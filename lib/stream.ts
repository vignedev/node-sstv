import sharp from 'sharp'
import { Mode, PCMFormat, SSTVEncoderOptions, ObjectFit, SampleFunction } from './types'
import { GetEncoder } from '../encoders'
import { Readable } from 'stream'
import { SamplesToBuffer } from './utils'

/** Outputs a SSTV PCM stream of set format */
export default class SSTVStream extends Readable{
    sampleRate: number
    pcmFormat: PCMFormat
    objectFit: ObjectFit
    resizeImage: boolean
    bufferSize: number = 8192

    mode: Mode
    image: sharp.Sharp

    samples: number[]
    phase: number
    eof: boolean

    /**
     * 
     * @param mode The mode the image should be encoded in
     * @param image Either a path to an image, buffer of a image or a Sharp image itself
     * @param options Tunable options to the encoding process
     */
    constructor(mode: Mode, image: string | Buffer | sharp.Sharp, options: SSTVEncoderOptions = {}){
        super({
            highWaterMark: 8192
        })

        this.sampleRate  = options.sampleRate  ?? 44100
        this.pcmFormat   = options.pcmFormat   ?? PCMFormat.UNSIGNED_16_LE
        this.objectFit   = options.objectFit   ?? 'cover'
        this.resizeImage = options.resizeImage ?? true

        this.mode = mode
        if(typeof image === 'string' || Buffer.isBuffer(image)) this.image = sharp(image)
        else this.image = image // assume it is a sharp.Sharp otherwise

        this.samples = []
        this.phase = 0
        this.eof = false
    }

    // this logic was mostly transcribed from echicken/node-sstv
    // however it was updated to be usable as a stream
    sample: SampleFunction = (frequency: number, duration: number | null) => {
        const n_samples = duration ? (this.sampleRate * (duration / 1000.0)) : 1
        for(let i = 0; i < n_samples; ++i){
            this.samples.push(Math.sin(this.phase))

            // TODO: maybe pause the encoding if the stream is not being read fast enough
            if(this.samples.length >= this.bufferSize)
                this.flush()

            this.phase += (2 * Math.PI * frequency) / this.sampleRate
            if(this.phase > (2 * Math.PI)) this.phase -= 2 * Math.PI
        }
    }

    /**
     * Convenience function to sample a line of arbitrary channel
     * @param scanline The line represented by numbers ranging from 0 to 255
     * @param samples Number of samples it should process
     * @param scale Scale of the sampling process
     */
    sampleLine(scanline: number[], samples: number, scale: number) {
        for(let i = 0; i < samples; ++i)
            this.sample(scanline[Math.floor(i * scale)], null)
    }

    /**
     * Retrieves the image as a buffer, resized or grayscaled if requested.
     * The width/height is requested by each of the encoders.
     * @param width Desired width of the image, refer to sharp's resize function
     * @param height Desired height of the image, refer to sharp's resize function
     * @param grayscale Grayscales the image
     * @returns Promise of image data in a buffer and its metadata
     */
    getImageBuffer(width: number | null, height: number | null, grayscale: boolean = false){
        if(this.resizeImage) this.image.resize(width, height, {fit: this.objectFit})
        this.image.grayscale(grayscale)
        return this.image.raw().toBuffer({ resolveWithObject: true })
    }

    /**
     * Samples the common ROBOT calibration header with approapriate VIS code
     * @param visCode VIS Calibration code
     * @param prependSSTVHeader Prepends the "SSTV" tone to the front
     */
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

    /**
     * Flushes the samples array into the stream queue
     * @param length Max amount of bytes to flush into the queue.
     * @returns If the reading can continue (refer to push function override documentation)
     */
    flush(length: number | undefined = undefined): boolean{
        const [ buffer, n_samples ] = SamplesToBuffer(this.samples, this.pcmFormat, length)
        this.samples = this.samples.slice(n_samples)

        if(this.samples.length == 0 && this.eof) return this.push(null)
        return this.push(buffer)
    }

    _construct(callback: (error?: Error | null | undefined) => void): void {
        const encoder = GetEncoder(this.mode)
        if(!encoder) throw Error('Invalid mode or encoder not linked.')
        encoder(this).then(() => {
            this.eof = true
            this.flush()
        })
        callback()
    }

    _read(size: number): void {
        this.flush(size)
    }

    _destroy(error: Error | null, callback: (error?: Error | null | undefined) => void): void {
        // TODO: abort the encoder if necessary, cleanup etc.
        callback(error)
    }
}