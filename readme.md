# `node-sstv`

(Another) SSTV image encoder for NodeJS. Inspired by [echicken/node-sstv](https://github.com/echicken/node-sstv). 

This library attempts to implement the encoding process of SSTV modes by following the [*Proposal for SSTV Mode Specifications*](http://www.barberdsp.com/downloads/Dayton%20Paper.pdf) paper by JL Barber, and [echicken/node-sstv](https://github.com/echicken/node-sstv)'s repository as reference for the encoding and scanline sampling.

## Example

```ts
import SSTVStream, { Mode, PCMFormat } from '.'
import * as fs from 'node:fs'

new SSTVStream(Mode.PASOKON_7, 'cute_tako.png', {
    pcmFormat: PCMFormat.SIGNED_16_LE,
    sampleRate: 44100
}).pipe(fs.createWriteStream('test.pcm'))
```

## License

MIT