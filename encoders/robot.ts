import { EncoderFunction, Mode, SampleFunction, SampleTuple } from '../lib/types'
import { resizeImage, rgb2yuv, yuv2freq } from '../lib/utils'

const RobotEncoder: EncoderFunction = async (mode, img, encoder) => {
    if(encoder.resizeImage) img = resizeImage(img, null, 240, encoder.objectFit)
    
    if(mode == Mode.ROBOT_36) encoder.sampleCalibrationHeader(8)
    else if(mode == Mode.ROBOT_72) encoder.sampleCalibrationHeader(12)

    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
    let yScanDuration: number, uvScanDuration: number, porchFreq: number

    if(mode == Mode.ROBOT_36){
        yScanDuration = 88
        uvScanDuration = 44
        porchFreq = 1500
    }else if(mode == Mode.ROBOT_72){
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
        ySamples = encoder.sampleRate * (yScanDuration / 1000.0),
        yScale = info.width / ySamples,
        uvSamples = encoder.sampleRate * (uvScanDuration / 1000.0),
        uvScale = info.width / uvSamples
    
    function scanLine(line: number[], n_samples: number, scale: number){
        for(let i = 0; i < n_samples; ++i)
            encoder.sample(line[Math.floor(scale * i)], null)
    }

    for(let y = 0; y < info.height; ++y){
        const isEven = y % 2 == 0

        // create yuv scans, where [0,1,2] = [y,u,v] scans of the line
        const yuvScans: number[][] = [ [], [], [] ]
        for(let x = 0; x < info.width; ++x){
            const offset = (y * info.width + x) * info.channels
            const yuv = rgb2yuv(data[offset], data[offset + 1], data[offset + 2])
            for(const c in yuv) yuvScans[c].push(yuv2freq(yuv[c]))
        }

        // sync + y-scans
        encoder.sample(...syncPulse)
        encoder.sample(...syncPorch)
        scanLine(yuvScans[0], ySamples, yScale)

        if(mode == Mode.ROBOT_36){
            // similar to node-sstv, no averaging is taking place -- too much work

            // {u,v}-scan | scan U on even and Y on odds
            encoder.sample(...(isEven ? separationPulse : oddSeparationPulse))
            encoder.sample(...porch)
            scanLine(yuvScans[isEven ? 1 : 2], uvSamples, uvScale)
        }else if(mode == Mode.ROBOT_72){
            // in the pdf it uses odd separation pulse, however using the same
            // separation pulse somehow resulted in better picture quality on edges
            // so for now i'm keeping it both the same separation pulse

            // u-scan
            encoder.sample(...separationPulse)
            encoder.sample(...porch)
            scanLine(yuvScans[1], uvSamples, uvScale)

            // v-scan
            encoder.sample(...separationPulse)
            encoder.sample(...porch)
            scanLine(yuvScans[2], uvSamples, uvScale)
        }
    }
}
export default RobotEncoder