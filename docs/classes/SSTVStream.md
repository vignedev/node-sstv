[node-sstv](../README.md) / [Exports](../modules.md) / SSTVStream

# Class: SSTVStream

Outputs a SSTV PCM stream of set format

## Hierarchy

- `Readable`

  ↳ **`SSTVStream`**

## Table of contents

### Constructors

- [constructor](SSTVStream.md#constructor)

### Properties

- [bufferSize](SSTVStream.md#buffersize)
- [eof](SSTVStream.md#eof)
- [image](SSTVStream.md#image)
- [mode](SSTVStream.md#mode)
- [objectFit](SSTVStream.md#objectfit)
- [pcmFormat](SSTVStream.md#pcmformat)
- [phase](SSTVStream.md#phase)
- [resizeImage](SSTVStream.md#resizeimage)
- [sampleRate](SSTVStream.md#samplerate)
- [samples](SSTVStream.md#samples)

### Methods

- [\_construct](SSTVStream.md#_construct)
- [\_destroy](SSTVStream.md#_destroy)
- [\_read](SSTVStream.md#_read)
- [flush](SSTVStream.md#flush)
- [getImageBuffer](SSTVStream.md#getimagebuffer)
- [sample](SSTVStream.md#sample)
- [sampleCalibrationHeader](SSTVStream.md#samplecalibrationheader)
- [sampleLine](SSTVStream.md#sampleline)

## Constructors

### constructor

• **new SSTVStream**(`mode`, `image`, `options?`): [`SSTVStream`](SSTVStream.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mode` | [`Mode`](../enums/Mode.md) | The mode the image should be encoded in |
| `image` | `string` \| `Buffer` \| `Sharp` | Either a path to an image, buffer of a image or a Sharp image itself |
| `options` | [`SSTVEncoderOptions`](../modules.md#sstvencoderoptions) | Tunable options to the encoding process |

#### Returns

[`SSTVStream`](SSTVStream.md)

#### Overrides

Readable.constructor

#### Defined in

[lib/stream.ts:28](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L28)

## Properties

### bufferSize

• **bufferSize**: `number` = `8192`

#### Defined in

[lib/stream.ts:13](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L13)

___

### eof

• **eof**: `boolean`

#### Defined in

[lib/stream.ts:20](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L20)

___

### image

• **image**: `Sharp`

#### Defined in

[lib/stream.ts:16](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L16)

___

### mode

• **mode**: [`Mode`](../enums/Mode.md)

#### Defined in

[lib/stream.ts:15](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L15)

___

### objectFit

• **objectFit**: [`ObjectFit`](../modules.md#objectfit)

#### Defined in

[lib/stream.ts:11](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L11)

___

### pcmFormat

• **pcmFormat**: [`PCMFormat`](../enums/PCMFormat.md)

#### Defined in

[lib/stream.ts:10](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L10)

___

### phase

• **phase**: `number`

#### Defined in

[lib/stream.ts:19](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L19)

___

### resizeImage

• **resizeImage**: `boolean`

#### Defined in

[lib/stream.ts:12](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L12)

___

### sampleRate

• **sampleRate**: `number`

#### Defined in

[lib/stream.ts:9](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L9)

___

### samples

• **samples**: `number`[]

#### Defined in

[lib/stream.ts:18](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L18)

## Methods

### \_construct

▸ **_construct**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

#### Overrides

Readable.\_construct

#### Defined in

[lib/stream.ts:141](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L141)

___

### \_destroy

▸ **_destroy**(`error`, `callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | ``null`` \| `Error` |
| `callback` | (`error?`: ``null`` \| `Error`) => `void` |

#### Returns

`void`

#### Overrides

Readable.\_destroy

#### Defined in

[lib/stream.ts:155](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L155)

___

### \_read

▸ **_read**(`size`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `size` | `number` |

#### Returns

`void`

#### Overrides

Readable.\_read

#### Defined in

[lib/stream.ts:151](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L151)

___

### flush

▸ **flush**(`length?`): `boolean`

Flushes the samples array into the stream queue

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `length` | `undefined` \| `number` | `undefined` | Max amount of bytes to flush into the queue. |

#### Returns

`boolean`

If the reading can continue (refer to push function override documentation)

#### Defined in

[lib/stream.ts:133](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L133)

___

### getImageBuffer

▸ **getImageBuffer**(`width`, `height`, `grayscale?`): `Promise`\<\{ `data`: `Buffer` ; `info`: `OutputInfo`  }\>

Retrieves the image as a buffer, resized or grayscaled if requested.
The width/height is requested by each of the encoders.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `width` | ``null`` \| `number` | `undefined` | Desired width of the image, refer to sharp's resize function |
| `height` | ``null`` \| `number` | `undefined` | Desired height of the image, refer to sharp's resize function |
| `grayscale` | `boolean` | `false` | Grayscales the image |

#### Returns

`Promise`\<\{ `data`: `Buffer` ; `info`: `OutputInfo`  }\>

Promise of image data in a buffer and its metadata

#### Defined in

[lib/stream.ts:86](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L86)

___

### sample

▸ **sample**(`frequency`, `duration`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `frequency` | `number` | Frequency of the sine in Hz |
| `duration` | ``null`` \| `number` | Duration in miliseconds. If set to `null`, it will only add a single sample to the PCM. |

#### Returns

`void`

#### Defined in

[lib/stream.ts:53](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L53)

___

### sampleCalibrationHeader

▸ **sampleCalibrationHeader**(`visCode`, `prependSSTVHeader?`): `void`

Samples the common ROBOT calibration header with approapriate VIS code

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `visCode` | `number` | `undefined` | VIS Calibration code |
| `prependSSTVHeader` | `boolean` | `true` | Prepends the "SSTV" tone to the front |

#### Returns

`void`

#### Defined in

[lib/stream.ts:97](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L97)

___

### sampleLine

▸ **sampleLine**(`scanline`, `samples`, `scale`): `void`

Convenience function to sample a line of arbitrary channel

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scanline` | `number`[] | The line represented by numbers ranging from 0 to 255 |
| `samples` | `number` | Number of samples it should process |
| `scale` | `number` | Scale of the sampling process |

#### Returns

`void`

#### Defined in

[lib/stream.ts:73](https://github.com/vignedev/node-sstv/blob/master/lib/stream.ts#L73)
