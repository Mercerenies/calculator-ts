
import Numeral, { numeral } from '../Numerical/Numeral'
import Expr from '../Expr'
import { Mode, AngularMode } from '../Mode'
import { never } from '../Util'

export function angleToRadFactor(mode: AngularMode): Numeral {
  switch (mode) {
    case AngularMode.Radians:
      return Numeral.one();
    case AngularMode.Degrees:
      return Numeral.pi().div(Numeral.fromInt(180));
  }
  return never(mode);
}

export function radToAngleFactor(mode: AngularMode): Numeral {
  return angleToRadFactor(mode).recip();
}

export function angleToRad(angle: Numeral, mode: AngularMode): Numeral {
  return angle.mul(angleToRadFactor(mode));
}

export function radToAngle(angle: Numeral, mode: AngularMode): Numeral {
  return angle.mul(radToAngleFactor(mode));
}

export function angleToRadFactorSym(mode: AngularMode): Expr {
  switch (mode) {
    case AngularMode.Radians:
      return Expr.from(1);
    case AngularMode.Degrees:
      return new Expr("/", [Expr.from("pi"), Expr.from(180)]);
  }
  return never(mode);
}

export function radToAngleFactorSym(mode: AngularMode): Expr {
  return new Expr("/", [Expr.from(1), angleToRadFactorSym(mode)]);
}
