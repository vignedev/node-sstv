import { EncoderFunction, SampleTuple } from "../lib/types";
import { rgb2freq, scanlineGenerator } from "../lib/utils";

const WrasseEncoder: EncoderFunction = async(mode, img, encoder) => {
    if(encoder.resizeImage) img.resize(320, 256, {fit: encoder.objectFit})
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })

    const
        syncPulse: SampleTuple = [ 1200, 5.5225 ],
        porch: SampleTuple = [ 1500, 0.5 ]

    const
        colorScanDuration = 235,
        colorScanSamples = encoder.sampleRate * (colorScanDuration / 1000.0),
        colorScanScale = info.width / colorScanSamples

    encoder.sampleCalibrationHeader(55)

    for(const [scanline, y] of scanlineGenerator(data, 'rgb', info, rgb2freq)){
        encoder.sample(...syncPulse)
        encoder.sample(...porch)

        for(let c = 0; c < 3; ++c){
            for(let i = 0; i < colorScanSamples; ++i){
                const freq = scanline[c][Math.floor(i * colorScanScale)]
                encoder.sample(freq, null)
            }
        }
    }
}

export default WrasseEncoder