import { EncoderFunction, Mode, SampleTuple } from '../lib/types'
import { rgb2yuv, scanlineGenerator, yuv2freq } from '../lib/utils'

const RobotEncoder: EncoderFunction = async (stream) => {
    const { data, info } = await stream.getImageBuffer(320, 240)
        
    if(stream.mode == Mode.ROBOT_36) stream.sampleCalibrationHeader(8)
    else if(stream.mode == Mode.ROBOT_72) stream.sampleCalibrationHeader(12)

    let yScanDuration: number, uvScanDuration: number, porchFreq: number

    if(stream.mode == Mode.ROBOT_36){
        yScanDuration = 88
        uvScanDuration = 44
        porchFreq = 1500
    }else if(stream.mode == Mode.ROBOT_72){
        yScanDuration = 138
        uvScanDuration = 69
        porchFreq = 1900
    }else{
        throw Error('Invalid ROBOT mode')
    }
    
    const
        syncPulse: SampleTuple = [ 1200, 9 ],
        syncPorch: SampleTuple = [ 1500, 3 ],
        separationPulse: SampleTuple = [ 1500, 4.5 ],
        oddSeparationPulse: SampleTuple = [ 2300, 4.5 ],
        porch: SampleTuple = [ porchFreq, 1.5 ]

    const
        ySamples = stream.sampleRate * (yScanDuration / 1000.0),
        yScale = info.width / ySamples,
        uvSamples = stream.sampleRate * (uvScanDuration / 1000.0),
        uvScale = info.width / uvSamples

    for(const [scanline, y] of scanlineGenerator(data, 'yuv', info, yuv2freq)){
        const isEven = y % 2 == 0

        stream.sample(...syncPulse)
        stream.sample(...syncPorch)
        stream.sampleLine(scanline[0], ySamples, yScale)

        if(stream.mode == Mode.ROBOT_36){
            // similar to node-sstv, no averaging is taking place -- too much work

            // {u,v}-scan | scan U on even and Y on odds
            stream.sample(...(isEven ? separationPulse : oddSeparationPulse))
            stream.sample(...porch)
            stream.sampleLine(scanline[isEven ? 1 : 2], uvSamples, uvScale)
        }else if(stream.mode == Mode.ROBOT_72){
            // in the pdf it uses odd separation pulse, however using the same
            // separation pulse somehow resulted in better picture quality on edges
            // so for now i'm keeping it both the same separation pulse

            // u-scan
            stream.sample(...separationPulse)
            stream.sample(...porch)
            stream.sampleLine(scanline[1], uvSamples, uvScale)

            // v-scan
            stream.sample(...separationPulse)
            stream.sample(...porch)
            stream.sampleLine(scanline[2], uvSamples, uvScale)
        }
    }
}
export default RobotEncoder