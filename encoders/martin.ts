import { EncoderFunction, Mode, SampleTuple } from "../lib/types";
import { rgb2freq, scanlineGenerator } from "../lib/utils";

type MartinModes = Mode.MARTIN_1 | Mode.MARTIN_2
const constants: Record<MartinModes, { [ key: string]: number }> = {
    [Mode.MARTIN_1]: {
        visCode: 44,
        scanDuration: 146.432
    },
    [Mode.MARTIN_2]: {
        visCode: 40,
        scanDuration: 73.216
    }
}

const MartinEncoder: EncoderFunction = async(stream) => {
    const { data, info } = await stream.getImageBuffer(320, 256)

    const { visCode, scanDuration } = constants[stream.mode as MartinModes]
    const
        syncPulse: SampleTuple = [ 1200, 4.862 ],
        syncPorch: SampleTuple = [ 1500, 0.572 ],
        separatorPulse: SampleTuple = [ 1500, 0.572 ]

    const
        scanSamples = stream.sampleRate * (scanDuration / 1000.0),
        scanScale = info.width / scanSamples

    stream.sampleCalibrationHeader(visCode)
    for(const [ scanline, y ] of scanlineGenerator(data, 'rgb', info, rgb2freq)){
        stream.sample(...syncPulse)
        stream.sample(...syncPorch)

        // MARTIN needs G B R
        // BUFFER   is  R G B / 0 1 2
        // (i + 1) % 3 => 0 = 1 [G]
        //                1 = 2 [B]
        //                2 = 0 [R]
        for(let c = 0; c < 3; ++c){
            stream.sampleLine(scanline[(c + 1) % 3], scanSamples, scanScale)
            stream.sample(...separatorPulse)
        }
    }
}

export default MartinEncoder