import sharp from 'sharp'
import { Mode, PCMFormat, SSTVEncoderOptions, ObjectFit, EncoderFunction, SampleFunction } from './types'
import { GetEncoder } from '../encoders'

/** SSTV Encoder class. Behind the scenes, it is just a PCM generator. */
export default class SSTVEncoder {
    sampleRate: number
    pcmFormat: PCMFormat
    objectFit: ObjectFit
    resizeImage: boolean

    samples: number[]
    phase: number

    constructor(options: SSTVEncoderOptions = {}){
        this.sampleRate  = options.sampleRate  ?? 44100
        this.pcmFormat   = options.pcmFormat   ?? PCMFormat.UNSIGNED_16_LE
        this.objectFit   = options.objectFit   ?? 'cover'
        this.resizeImage = options.resizeImage ?? true

        this.samples = []
        this.phase = 0
    }

    /** Resets the internal buffers and timers */
    private reset(){
        this.samples = []
        this.phase = 0
    }

    // this logic was mostly transcribed from echicken/node-sstv
    sample: SampleFunction = (frequency: number, duration: number | null) => {
        const n_samples = duration ? (this.sampleRate * (duration / 1000.0)) : 1
        for(let i = 0; i < n_samples; ++i){
            this.samples.push(Math.sin(this.phase))
            this.phase += (2 * Math.PI * frequency) / this.sampleRate
            if(this.phase > (2 * Math.PI)) this.phase -= 2 * Math.PI
        }
    }

    async encode(mode: Mode, image: string | Buffer | sharp.Sharp): Promise<Buffer>{
        this.reset() // just to ensure clean slate

        // get the sharp image
        let img: sharp.Sharp
        if(typeof image === 'string' || Buffer.isBuffer(image)) img = sharp(image)
        else img = image // assume it is a sharp.Sharp otherwise

        // encode the image
        await GetEncoder(mode)!(
            mode,
            img,
            this
        )

        // TODO: create a sample writer
        const buffer = Buffer.alloc(this.samples.length * 4)
        for(const i in this.samples){
            const sample = this.samples[i]
            buffer.writeFloatLE(sample, parseInt(i, 10) * 4)
        }
        return buffer
    }

    // common for all sstvs (headers and such)
    sampleCalibrationHeader(visCode: number, prependSSTVHeader: boolean = true) {
        // the sstv header, or as previous repo called it the "deedleEedleMeepMeep"
        if(prependSSTVHeader){
            this.sample(1900, 100)
            this.sample(1500, 100)
            this.sample(1900, 100)
            this.sample(1500, 100)
            this.sample(2300, 100)
            this.sample(1500, 100)
            this.sample(2300, 100)
            this.sample(1500, 100)
        }

        // actual calibration header
        this.sample(1900, 300) // Leader tone
        this.sample(1200, 10)  // Break
        this.sample(1900, 300) // Leader Tone
        this.sample(1200, 30)  // VIS Start Bit
    
        // visCode is then transmitted as 6bit LSB with 7th bit being parity
        let isEven = false
        for(let i = 0; i < 7; ++i){
            const mask = (visCode & (1 << i)) != 0
            this.sample(mask ? 1100 : 1300, 30)
            if(mask) isEven = !isEven
        }
        this.sample(isEven ? 1300 : 1100, 30) // parity
    
        this.sample(1200, 30)  // VIS End bit
    }
}