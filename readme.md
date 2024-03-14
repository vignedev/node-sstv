# `node-sstv`

(Another) SSTV image encoder for NodeJS. Inspired by [echicken/node-sstv](https://github.com/echicken/node-sstv). 

This library attempts to implement the encoding process of SSTV modes by following the [*Proposal for SSTV Mode Specifications*](http://www.barberdsp.com/downloads/Dayton%20Paper.pdf) paper by JL Barber, and [echicken/node-sstv](https://github.com/echicken/node-sstv)'s repository as reference for the PCM generation and scanline sampling.

## Examples

- Creates a SSTV stream using mode Pakoson 7 into a file.
    ```js
    const { SSTVStream, Mode, PCMFormat } = require('node-sstv')
    const fs = require('node:fs')

    new SSTVStream(Mode.PASOKON_7, 'cute_tako.png', {
        pcmFormat: PCMFormat.SIGNED_16_LE,
        sampleRate: 44100
    }).pipe(fs.createWriteStream('sstv_tako.pcm'))
    ```
- Creates a SSTV stream and plays it out of the speakers (using `ffplay`)
    ```js
    const { SSTVStream, Mode, PCMFormat } = require('node-sstv')
    const { spawn } = require('node:child_process')

    const ffplay = spawn('ffplay', [
        '-f', 's16le',
        '-ar', '44100',
        '-ac', '1',
        '-autoexit',
        '-'
    ])

    new SSTVStream(Mode.PASOKON_7, 'cute_tako.png', {
        pcmFormat: PCMFormat.SIGNED_16_LE,
        sampleRate: 44100
    }).pipe(ffplay.stdin)
    ```

## API

Refer to the [generated documentation](docs/modules.md).

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
- [x] FAX480

## License

MIT