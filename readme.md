# `node-sstv`

(Another) SSTV image encoder for NodeJS. Inspired by [echicken/node-sstv](https://github.com/echicken/node-sstv). 

This library attempts to implement the encoding process of SSTV modes by following the [*Proposal for SSTV Mode Specifications*](http://www.barberdsp.com/downloads/Dayton%20Paper.pdf) paper by JL Barber, and [echicken/node-sstv](https://github.com/echicken/node-sstv)'s repository as reference for the encoding and scanline sampling.

## Supported modes

- [ ] Scottie
    - [ ] Scottie 1
    - [ ] Scottie 2
    - [ ] Scottie DX
- [ ] Martin
    - [ ] Martin 1
    - [ ] Martin 2
- [x] Robot Color
    - [x] Robot 36
    - [x] Robot 72
- [x] Wrasse SC2-180
- [x] Pasokon "P"
    - [x] Pasokon 3
    - [x] Pasokon 5
    - [x] Pasokon 7
- [ ] "PD" Modes
    - [ ] PD50
    - [ ] PD90
    - [ ] PD120
    - [ ] PD160
    - [ ] PD180
    - [ ] PD240
    - [ ] PD290
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