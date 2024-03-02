# `node-sstv`

(Another) SSTV image encoder for NodeJS. Inspired by [echicken/node-sstv](https://github.com/echicken/node-sstv). 

This library attempts to implement the encoding process in accordance to the paper [*Proposal for SSTV Mode Specifications*](http://www.barberdsp.com/downloads/Dayton%20Paper.pdf) by JL Barber.

## Example

```ts
import * as fs from 'node:fs/promises'
import { SSTVEncoder, Mode } from 'node-sstv';

const encoder = new SSTVEncoder()
encoder.encode(Mode.ROBOT_36, 'cute_tako.png').then(buffer =>
    fs.writeFile('cute_tako_s16le_44100.pcm', buffer)
)
```

## License

MIT