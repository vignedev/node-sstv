# `node-sstv`

(Another) SSTV image encoder for NodeJS. Inspired by [echicken/node-sstv](https://github.com/echicken/node-sstv). 

This library attempts to implement the encoding process of SSTV modes by following the [*Proposal for SSTV Mode Specifications*](http://www.barberdsp.com/downloads/Dayton%20Paper.pdf) paper by JL Barber, and [echicken/node-sstv](https://github.com/echicken/node-sstv)'s repository as reference for the encoding and scanline sampling.

## Supported modes

- [x] Scottie
    - [x] Scottie 1
    - [x] Scottie 2
    - [x] Scottie DX
- [x] Martin
    - [x] Martin 1
    - [x] Martin 2
- [x] Robot Color
    - [x] Robot 36
    - [x] Robot 72
- [x] Wrasse SC2-180
- [x] Pasokon "P"
    - [x] Pasokon 3
    - [x] Pasokon 5
    - [x] Pasokon 7
- [x] "PD" Modes
    - [x] PD50
    - [x] PD90
    - [x] PD120
    - [x] PD160
    - [x] PD180
    - [x] PD240
    - [x] PD290
- [ ] FAX480

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