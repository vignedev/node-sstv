[node-sstv](README.md) / Exports

# node-sstv

## Table of contents

### References

- [default](modules.md#default)

### Enumerations

- [Mode](enums/Mode.md)
- [PCMFormat](enums/PCMFormat.md)

### Classes

- [SSTVStream](classes/SSTVStream.md)

### Type Aliases

- [ObjectFit](modules.md#objectfit)
- [SSTVEncoderOptions](modules.md#sstvencoderoptions)

## References

### default

Renames and re-exports [SSTVStream](classes/SSTVStream.md)

## Type Aliases

### ObjectFit

Ƭ **ObjectFit**: ``"cover"`` \| ``"contain"`` \| ``"fill"`` \| ``"inside"`` \| ``"outside"``

The way the image is resized to fit the SSTV Mode's resolution.

#### Defined in

[lib/types.ts:5](https://github.com/vignedev/node-sstv/blob/master/lib/types.ts#L5)

___

### SSTVEncoderOptions

Ƭ **SSTVEncoderOptions**: `Object`

Options to the SSTV Encoder

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectFit?` | [`ObjectFit`](modules.md#objectfit) | Used when `resizeImage` is set to `true`. Defines the behavior during the image akin to `object-fit` in CSS. Defaults to `'cover'`. |
| `pcmFormat?` | [`PCMFormat`](enums/PCMFormat.md) | Selects the data format of the output PCM. Defaults to `PCMFormat.UNSIGNED_16_LE`. |
| `resizeImage?` | `boolean` | If set to `true`, the image is resized approapriately to the selected SSTV mode. Defaults to `true`. |
| `sampleRate?` | `number` | Sample rate of the output PCM. Defaults to `44100`. |

#### Defined in

[lib/types.ts:84](https://github.com/vignedev/node-sstv/blob/master/lib/types.ts#L84)
