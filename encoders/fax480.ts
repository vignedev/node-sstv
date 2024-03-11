import { EncoderFunction, SampleTuple } from "../lib/types";
import { bw2freq, scanlineGenerator } from "../lib/utils";

const FAX480Encoder: EncoderFunction = async(stream) => {
    const { data, info } = await stream.getImageBuffer(512, 480, true)

    const
        scanDuration = 262.144,
        scanSamples = stream.sampleRate * (scanDuration / 1000.0),
        scanScale = info.width / scanSamples
    
    const
        sync: SampleTuple = [ 1200, 5.12 ]

    // FAX header tone
    for(let i = 0; i < 1220; ++i){
        stream.sample(2300, 2.05)
        stream.sample(1500, 2.05)
    }

    // phasing (send 20 white lines)
    for(let i = 0; i < 20; ++i){
        stream.sample(...sync)
        for(let y = 0; y < scanSamples; ++y) stream.sample(2300, null)
    }

    // monochrome scan lines
    for(const [ scanline ] of scanlineGenerator(data, info, 'bw', bw2freq)){
        stream.sample(...sync)
        stream.sampleLine(scanline[0], scanSamples, scanScale)
    }
}

export default FAX480Encoder