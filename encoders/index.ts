import StubEncoder from "./stub"
import { EncoderFunction, Mode } from "../lib/types"
import RobotEncoder from "./robot"
import WrasseEncoder from "./wrasse"
import PakosonEncoder from "./pakoson"

const ModeToEncoderMapping: { [key in Mode]: EncoderFunction } = {
    [Mode.SCOTTIE_1 ]: StubEncoder,
    [Mode.SCOTTIE_2 ]: StubEncoder,
    [Mode.SCOTTIE_DX]: StubEncoder,
    [Mode.MARTIN_1  ]: StubEncoder,
    [Mode.MARTIN_2  ]: StubEncoder,
    [Mode.ROBOT_36  ]: RobotEncoder,
    [Mode.ROBOT_72  ]: RobotEncoder,
    [Mode.SC2_180   ]: WrasseEncoder,
    [Mode.PASOKON_3 ]: PakosonEncoder,
    [Mode.PASOKON_5 ]: PakosonEncoder,
    [Mode.PASOKON_7 ]: PakosonEncoder,
    [Mode.PD50      ]: StubEncoder,
    [Mode.PD90      ]: StubEncoder,
    [Mode.PD120     ]: StubEncoder,
    [Mode.PD160     ]: StubEncoder,
    [Mode.PD180     ]: StubEncoder,
    [Mode.PD240     ]: StubEncoder,
    [Mode.PD290     ]: StubEncoder,
    [Mode.FAX480    ]: StubEncoder,
}

export function GetEncoder(mode: Mode): EncoderFunction | null {
    return ModeToEncoderMapping[mode] ?? null
}