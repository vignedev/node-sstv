node-sstv / [Exports](modules.md)

# `node-sstv`

(Another) SSTV image encoder for NodeJS. Inspired by [echicken/node-sstv](https://github.com/echicken/node-sstv). 

This library attempts to implement the encoding process of SSTV modes by following the [*Proposal for SSTV Mode Specifications*](http://www.barberdsp.com/downloads/Dayton%20Paper.pdf) paper by JL Barber, and [echicken/node-sstv](https://github.com/echicken/node-sstv)'s repository as reference for the PCM generation and scanline sampling.

## API

Refer to the [generated documentation](docs/modules.md).

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

## Supported modes

|Mode|Alias|
|-|-|
|Scottie 1|`Mode.SCOTTIE_1`|
|Scottie 2|`Mode.SCOTTIE_2`|
|Scottie DX|`Mode.SCOTTIE_DX`|
|Martin 1|`Mode.MARTIN_1`|
|Martin 2|`Mode.MARTIN_2`|
|Robot Color 36|`Mode.ROBOT_36`|
|Robot Color 72|`Mode.ROBOT_72`|
|Wrasse SC2-180|`Mode.SC2_180`|
|Pasokon 3|`Mode.PASOKON_3`|
|Pasokon 5|`Mode.PASOKON_5`|
|Pasokon 7|`Mode.PASOKON_7`|
|PD50|`Mode.PD50`|
|PD90|`Mode.PD90`|
|PD120|`Mode.PD120`|
|PD160|`Mode.PD160`|
|PD180|`Mode.PD180`|
|PD240|`Mode.PD240`|
|PD290|`Mode.PD290`|
|FAX480|`Mode.FAX480`|

## License

MIT
