import { EncoderFunction, SampleTuple } from "../lib/types";
import { rgb2freq, scanlineGenerator } from "../lib/utils";

const WrasseEncoder: EncoderFunction = async(stream) => {
    if(stream.resizeImage) stream.image.resize(320, 256, {fit: stream.objectFit})
    const { data, info } = await stream.image.raw().toBuffer({ resolveWithObject: true })

    const
        syncPulse: SampleTuple = [ 1200, 5.5225 ],
        porch: SampleTuple = [ 1500, 0.5 ]

    const
        colorScanDuration = 235,
        colorScanSamples = stream.sampleRate * (colorScanDuration / 1000.0),
        colorScanScale = info.width / colorScanSamples

    stream.sampleCalibrationHeader(55)

    for(const [scanline, y] of scanlineGenerator(data, 'rgb', info, rgb2freq)){
        stream.sample(...syncPulse)
        stream.sample(...porch)

        for(let c = 0; c < 3; ++c)
            stream.sampleLine(scanline[c], colorScanSamples, colorScanScale)
    }
}

export default WrasseEncoder