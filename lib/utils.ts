import { OutputInfo, Sharp } from "sharp";
import { ObjectFit, SampleFunction } from "./types";

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

export function rgb2freq(value: number){
    // according to pdf, it does the same calc as yuv2freq
    return yuv2freq(value)
}

export function* scanlineGenerator(buffer: Buffer, colorspace: 'rgb' | 'yuv', info: OutputInfo, map?: (value: number, channel: number) => number): Generator<[scanLine: number[][], lineNumber: number]>{
    for(let y = 0; y < info.height; ++y){
        const scans: number[][] = [ [], [], [] ]
        for(let x = 0; x < info.width; ++x){
            const offset = (y * info.width + x) * info.channels

            if(colorspace == 'yuv'){
                const pixel: [number, number, number] = [0, 0, 0]
                for(let c = 0; c < 3; ++c)
                    pixel[c] = buffer[offset + c]
                const yuv = rgb2yuv(...pixel)
                for(let c = 0; c < 3; ++c)
                    scans[c].push(map ? map(yuv[c], c) : yuv[c])
            }else if(colorspace == 'rgb'){
                for(let c = 0; c < 3; ++c){
                    const value = buffer[offset + c]
                    scans[c].push(map ? map(value, c) : value)
                }
            }
        }
        yield [ scans, y ]
    }

}