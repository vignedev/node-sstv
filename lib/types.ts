import sharp from 'sharp'
import SSTVStream from './stream'

export type ObjectFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

export enum Mode {
    // SCOTTIE modes
    SCOTTIE_1,
    SCOTTIE_2,
    SCOTTIE_DX,

    // MARTIN modes
    MARTIN_1,
    MARTIN_2,
    
    // ROBOT modes
    ROBOT_36,
    ROBOT_72,

    // WRASSE SC2-180
    SC2_180,

    // PASOKON modes (is that Japanese?)
    PASOKON_3,
    PASOKON_5,
    PASOKON_7,

    // PD Modes
    PD50,
    PD90,
    PD120,
    PD160,
    PD180,
    PD240,
    PD290,

    // FAX480 mode
    FAX480
}

export enum PCMFormat {
    UNSIGNED_8,
    UNSIGNED_16_LE,
    UNSIGNED_16_BE,
    UNSIGNED_32_LE,
    UNSIGNED_32_BE,

    SIGNED_8,
    SIGNED_16_LE,
    SIGNED_16_BE,
    SIGNED_32_LE,
    SIGNED_32_BE,
    
    FLOAT_32_LE,
    FLOAT_32_BE,
    FLOAT_64_LE,
    FLOAT_64_BE
}
export const PCMFormatSizes: { [ key in PCMFormat ]: number } = {
    [PCMFormat.UNSIGNED_8    ]: 1,
    [PCMFormat.SIGNED_8      ]: 1,

    [PCMFormat.UNSIGNED_16_LE]: 2,
    [PCMFormat.UNSIGNED_16_BE]: 2,
    [PCMFormat.SIGNED_16_LE  ]: 2,
    [PCMFormat.SIGNED_16_BE  ]: 2,

    [PCMFormat.UNSIGNED_32_LE]: 4,
    [PCMFormat.UNSIGNED_32_BE]: 4,
    [PCMFormat.SIGNED_32_LE  ]: 4,
    [PCMFormat.SIGNED_32_BE  ]: 4,
    [PCMFormat.FLOAT_32_LE   ]: 4,
    [PCMFormat.FLOAT_32_BE   ]: 4,

    [PCMFormat.FLOAT_64_LE   ]: 8,
    [PCMFormat.FLOAT_64_BE   ]: 8,
}

/** Options to the SSTV Encoder */
export type SSTVEncoderOptions = {
    /** Sample rate of the output PCM. Defaults to `44100`. */
    sampleRate?: number

    /** Selects the data format of the output PCM. Defaults to `PCMFormat.UNSIGNED_16_LE`. */
    pcmFormat?: PCMFormat

    /** Used when `resizeImage` is set to `true`. Defines the behavior during the image
     *  akin to `object-fit` in CSS. Defaults to `'cover'`.*/
    objectFit?: ObjectFit

    /** If set to `true`, the image is resized approapriately to the selected SSTV mode.
     *  Defaults to `true`.*/
    resizeImage?: boolean
}

/**
 * @param {number} frequency Frequency of the sine in Hz
 * @param {number | null} duration Duration in miliseconds. If set to `null`, it will only add a single sample to the PCM.
 */
export type SampleFunction = (frequency: number, duration: number | null) => void

/** Combination of `[0] = frequency` and `[1] = duration`*/
export type SampleTuple = [number, number]

/**
 * Functions responsible for *resizing the image* for the mode if requested and the encoding it 
 * @param {SSTVStream} stream
 */
export type EncoderFunction = (stream: SSTVStream) => Promise<void>