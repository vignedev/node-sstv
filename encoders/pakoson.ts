import { EncoderFunction, Mode, SampleTuple } from "../lib/types";
import { rgb2freq, scanlineGenerator } from "../lib/utils";


const constants = {
    [Mode.PASOKON_3]: {
        visCode: 113,
        scanDuration: 133.333,
        syncDuration: 5.208,
        porchDuration: 1.042,
    },
    [Mode.PASOKON_5]: {
        visCode: 114,
        scanDuration: 200.000,
        syncDuration: 7.813,
        porchDuration: 1.563,
    },
    [Mode.PASOKON_7]: {
        visCode: 115,
        scanDuration: 266.666,
        syncDuration: 10.417,
        porchDuration: 2.083,
    }
}

const PakosonEncoder: EncoderFunction = async(stream) => {
    if(stream.resizeImage) stream.image.resize(640, 496, {fit: stream.objectFit})
    const { data, info } = await stream.image.raw().toBuffer({ resolveWithObject: true })

    // @ts-ignore
    const { visCode, scanDuration, syncDuration, porchDuration } = constants[stream.mode]
    const syncFrequency = 1200, porchFrequency = 1500

    const
        syncPulse: SampleTuple = [ syncFrequency, syncDuration ],
        porch: SampleTuple = [ porchFrequency, porchDuration ]

    const
        scanSamples = stream.sampleRate * (scanDuration / 1000.0),
        scanScale = info.width / scanSamples

    stream.sampleCalibrationHeader(visCode)

    for(const [scanline, y] of scanlineGenerator(data, 'rgb', info, rgb2freq)){
        stream.sample(...syncPulse)
        for(let c = 0; c < 3; ++c){
            stream.sample(...porch)
            for(let i = 0; i < scanSamples; ++i)
                stream.sample(scanline[c][Math.floor(i * scanScale)], null)
        }
        stream.sample(...porch)
    }
}

export default PakosonEncoder