import { EncoderFunction, Mode, SampleTuple } from "../lib/types";
import { rgb2freq, scanlineGenerator } from "../lib/utils";

type ScottieModes = Mode.SCOTTIE_1 | Mode.SCOTTIE_2 | Mode.SCOTTIE_DX
const constants: Record<ScottieModes, { [ key: string ]: number}> = {
    [Mode.SCOTTIE_1]:{
        visCode: 60,
        scanDuration: 138.240
    },
    [Mode.SCOTTIE_2]:{
        visCode: 56,
        scanDuration: 88.064
    },
    [Mode.SCOTTIE_DX]:{
        visCode: 76,
        scanDuration: 345.6
    }
}
const ScottieEncoder: EncoderFunction = async(stream) => {
    const { data, info } = await stream.getImageBuffer(320, 256)

    const { visCode, scanDuration } = constants[stream.mode as ScottieModes]
    
    const
        separatorPulse: SampleTuple = [ 1500, 1.5 ],
        syncPulse: SampleTuple = [ 1200, 9 ],
        syncPorch: SampleTuple = [ 1500, 1.5 ]
    
    const
        scanSamples = stream.sampleRate * (scanDuration / 1000.0),
        scanScale = info.width / scanSamples

    stream.sampleCalibrationHeader(visCode)
    
    // starting sync pulse
    stream.sample(...syncPulse)

    for(const [ scanline, y ] of scanlineGenerator(data, 'rgb', info, rgb2freq)){
        stream.sample(...separatorPulse)
        stream.sampleLine(scanline[1], scanSamples, scanScale) // green
        stream.sample(...separatorPulse)
        stream.sampleLine(scanline[2], scanSamples, scanScale) // blue
        stream.sample(...syncPulse)
        stream.sample(...syncPorch)
        stream.sampleLine(scanline[0], scanSamples, scanScale) // red
    }
}

export default ScottieEncoder