import { OutputInfo } from "sharp";
import { PCMFormat, PCMFormatSizes } from "./types";

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

/**
 * Converts samples to a Buffer object
 * @param samples The samples to be converted to buffer
 * @param format The type of the format the PCM should take shape
 * @param length Maximum amount of bytes to flush out. If undefined, all samples are flushed
 * @returns Array consisting of the buffer and the number of samples contained within it
 */
export function SamplesToBuffer(samples: number[], format: PCMFormat, length: number | undefined): [ buffer: Buffer, samples: number ]{
    const size = PCMFormatSizes[format]
    const n_samples = length ? Math.min(Math.floor(length / size), samples.length) : samples.length
    if(n_samples == 0) return [ Buffer.alloc(0), 0 ]

    const buffer = Buffer.alloc(n_samples * size)
    let writer: (val:number, off:number) => number
    let signed: boolean, max: number

    switch(format){
        case PCMFormat.UNSIGNED_8:
            writer = buffer.writeUint8
            signed = false; max = 0xFF
            break
        case PCMFormat.SIGNED_8:
            writer = buffer.writeInt8
            signed = true; max = 0xFF
            break
        case PCMFormat.UNSIGNED_16_LE:
            writer = buffer.writeUint16LE
            signed = false; max = 0xFFFF
            break
        case PCMFormat.UNSIGNED_16_BE:
            writer = buffer.writeUint16BE
            signed = false; max = 0xFFFF
            break
        case PCMFormat.SIGNED_16_LE:
            writer = buffer.writeInt16LE
            signed = true; max = 0x7FFF
            break
        case PCMFormat.SIGNED_16_BE:
            writer = buffer.writeInt16BE
            signed = true; max = 0x7FFF
            break
        case PCMFormat.UNSIGNED_32_LE:
            writer = buffer.writeUint32LE
            signed = false; max = 0xFFFFFFFF
            break
        case PCMFormat.UNSIGNED_32_BE:
            writer = buffer.writeUint32BE
            signed = false; max = 0xFFFFFFFF
            break
        case PCMFormat.SIGNED_32_LE:
            writer = buffer.writeInt32LE
            signed = true; max = 0x7FFFFFFF
            break
        case PCMFormat.SIGNED_32_BE:
            writer = buffer.writeInt32BE
            signed = true; max = 0x7FFFFFFF
            break
        case PCMFormat.FLOAT_32_LE:
            writer = buffer.writeFloatLE
            signed = true; max = 1.0
            break
        case PCMFormat.FLOAT_32_BE:
            writer = buffer.writeFloatBE
            signed = true; max = 1.0
            break
        case PCMFormat.FLOAT_64_LE:
            writer = buffer.writeDoubleLE
            signed = true; max = 1.0
            break
        case PCMFormat.FLOAT_64_BE:
            writer = buffer.writeDoubleBE
            signed = true; max = 1.0
            break
    }
    
    writer = writer.bind(buffer)
    for(let i = 0; i < n_samples; ++i){
        if(signed){
            writer(samples[i] * max, i * size)
        }else{
            const normalized = (samples[i] + 1.0) / 2.0
            writer(normalized * max, i * size)
        }
    }

    return [ buffer, n_samples ]
}