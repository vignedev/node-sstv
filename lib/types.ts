import sharp from 'sharp'

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

    // PAKOSON modes (is that Japanese?)
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
    UNSIGNED_24_LE,
    UNSIGNED_24_BE,
    UNSIGNED_32_LE,
    UNSIGNED_32_BE,

    SIGNED_8,
    SIGNED_16_LE,
    SIGNED_16_BE,
    SIGNED_24_LE,
    SIGNED_24_BE,
    SIGNED_32_LE,
    SIGNED_32_BE,
    
    FLOAT_32_LE,
    FLOAT_32_BE,
    FLOAT_64_LE,
    FLOAT_64_BE
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
 * @param {Mode} mode The mode it has been assigned
 * @param {sharp.Sharp} image The sharp image
 * @param {ObjectFit | null} objectFit Determines whether it needs to be resized or not. If set to `null`, resizing does not occur.
 * @param {SampleFunction} sample Function that adds samples of certain frequency and duration.
 * @param {number} sampleRate The given sample rate
 */
export type EncoderFunction = (mode: Mode, image: sharp.Sharp, objectFit: ObjectFit | null, sample: SampleFunction, sampleRate: number) => Promise<void>