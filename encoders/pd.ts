import { EncoderFunction, Mode, SampleTuple } from "../lib/types";
import { yuv2freq, scanlineGenerator, averageTwoLines } from "../lib/utils";

type PDModes = Mode.PD50 | Mode.PD90 | Mode.PD120 | Mode.PD160 | Mode.PD180 | Mode.PD240 | Mode.PD290
const constants: Record<PDModes, { [ key: string ]: number }> = {
    [Mode.PD50]: {
        visCode: 93,
        width: 320,
        height: 256,
        scanDuration: 91.520
    },
    [Mode.PD90]: {
        visCode: 99,
        width: 320,
        height: 256,
        scanDuration: 170.240
    },
    [Mode.PD120]: {
        visCode: 95,
        width: 640,
        height: 496,
        scanDuration: 121.600
    },
    [Mode.PD160]: {
        visCode: 98,
        width: 512,
        height: 400,
        scanDuration: 195.574
    },
    [Mode.PD180]: {
        visCode: 96,
        width: 640,
        height: 496,
        scanDuration: 183.040
    },
    [Mode.PD240]: {
        visCode: 97,
        width: 640,
        height: 496,
        scanDuration: 244.480
    },
    [Mode.PD290]: {
        visCode: 94,
        width: 800,
        height: 616,
        scanDuration: 228.800
    }
}

const PDEncoder: EncoderFunction = async(stream) => {
    const { visCode, width, height, scanDuration } = constants[stream.mode as PDModes]
    const { data, info } = await stream.getImageBuffer(width, height)

    const
        syncPulse: SampleTuple = [ 1200, 20 ],
        porch: SampleTuple = [ 1500, 2.080 ],
        scanSamples = stream.sampleRate * (scanDuration / 1000.0),
        scanScale = info.width / scanSamples

    stream.sampleCalibrationHeader(visCode)
    
    let prev_scanline: number[][] | null = null
    for(const [ scanline, y ] of scanlineGenerator(data, info, 'yuv', yuv2freq)){
        if(y % 2 == 0){ // sample both lines at once [prev_scanline, scanline]
            prev_scanline = scanline
            continue
        }
        if(prev_scanline == null) continue // to satisfy the ts overlords without ts-ignore

        stream.sample(...syncPulse)
        stream.sample(...porch)

        const
            averageU = averageTwoLines(prev_scanline[1], scanline[1]),
            averageV = averageTwoLines(prev_scanline[2], scanline[2])

        stream.sampleLine(prev_scanline[0], scanSamples, scanScale) // scan Y of odd lines
        stream.sampleLine(averageU, scanSamples, scanScale) // U, averaged
        stream.sampleLine(averageV, scanSamples, scanScale) // V, averaged
        stream.sampleLine(scanline[0], scanSamples, scanScale) // scan Y of even lines
    }
}

export default PDEncoder