import StubEncoder from "./stub"
import { EncoderFunction, Mode } from "../lib/types"
import RobotEncoder from "./robot"
import WrasseEncoder from "./wrasse"
import PasokonEncoder from "./pasokon"
import ScottieEncoder from "./scottie"
import MartinEncoder from "./martin"
import PDEncoder from "./pd"

const ModeToEncoderMapping: { [key in Mode]: EncoderFunction } = {
    [Mode.SCOTTIE_1 ]: ScottieEncoder,
    [Mode.SCOTTIE_2 ]: ScottieEncoder,
    [Mode.SCOTTIE_DX]: ScottieEncoder,
    [Mode.MARTIN_1  ]: MartinEncoder,
    [Mode.MARTIN_2  ]: MartinEncoder,
    [Mode.ROBOT_36  ]: RobotEncoder,
    [Mode.ROBOT_72  ]: RobotEncoder,
    [Mode.SC2_180   ]: WrasseEncoder,
    [Mode.PASOKON_3 ]: PasokonEncoder,
    [Mode.PASOKON_5 ]: PasokonEncoder,
    [Mode.PASOKON_7 ]: PasokonEncoder,
    [Mode.PD50      ]: PDEncoder,
    [Mode.PD90      ]: PDEncoder,
    [Mode.PD120     ]: PDEncoder,
    [Mode.PD160     ]: PDEncoder,
    [Mode.PD180     ]: PDEncoder,
    [Mode.PD240     ]: PDEncoder,
    [Mode.PD290     ]: PDEncoder,
    [Mode.FAX480    ]: StubEncoder,
}

export function GetEncoder(mode: Mode): EncoderFunction | null {
    return ModeToEncoderMapping[mode] ?? null
}