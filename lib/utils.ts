import { Sharp } from "sharp";
import { ObjectFit, SampleFunction } from "./types";

export function resizeImage(img: Sharp, width: number | null, height: number | null, objectFit: ObjectFit | null) {
    return objectFit != null ? img.resize(width, height, { fit: objectFit! }) : img
}

export function sampleCalibrationHeader(visCode: number, sample: SampleFunction) {
    sample(1900, 300) // Leader tone
    sample(1200, 10)  // Break
    sample(1900, 300) // Leader Tone
    sample(1200, 30)  // VIS Start Bit

    // visCode is then transmitted as 6bit LSB with 7th bit being parity
    let isEven = false
    for(let i = 0; i < 7; ++i){
        const mask = (visCode & (1 << i)) != 0
        sample(mask ? 1100 : 1300, 30)
        if(mask) isEven = !isEven
    }
    sample(isEven ? 1300 : 1100, 30) // parity

    sample(1200, 30)  // VIS End bit
}

// equation copied verbatim from the pdf
export function rgb2yuv(r: number, g: number, b: number): number[]{
    return [
        16.0 + (.003906 * ((65.738 * r) + (129.057 * g) + (25.064 * b))),
        128.0 + (.003906 * ((112.439 * r) + (-94.154 * g) + (-18.285 * b))),
        128.0 + (.003906 * ((-37.945 * r) + (-74.494 * g) + (112.439 * b)))
    ]
}

export function yuv2freq(value: number){
    return 1500 + (value * 3.1372549)
}

// Can't find the approapriate name for it, and the node-sstv repository named it the "deedleEedleMeepMeep"
export function sstvHeader(sample: SampleFunction){
    sample(1900, 100)
    sample(1500, 100)
    sample(1900, 100)
    sample(1500, 100)
    sample(2300, 100)
    sample(1500, 100)
    sample(2300, 100)
    sample(1500, 100)
}