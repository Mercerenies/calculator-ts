
import Expr from '../Expr'
import * as Compound from '../Compound'
import Unit from './Unit'
import Dimension from './Dimension'
import { nratio } from '../Numerical/Numeral'

// So we need a special module to deal with temperature shenanigans.
// Temperatures are weird because (aside from Kelvins) they have a
// translation component. If we use the usual unit conversion
// functions, they'll treat 0 degC the same as 0 degF the same as 0 K,
// which is fine if the temperatures are relative but not if they're
// absolute. If we want to do absolute temperature conversions, we
// need this module.

// It is recommended that you import this module qualified, as its
// Unit type conflicts with the one from Unit.ts.

// A temperature consists of a scaling followed by a translation.
// These are the necessary transformations (in that order) to go from
// the unit TO the base (i.e. Kelvins).
interface TemperatureUnit {
  scale: Expr;
  translate: Expr;
}
export { TemperatureUnit as Unit };

export const Kelvins: [string, TemperatureUnit] = ["K", {
  scale: Expr.from(1),
  translate: Expr.from(0),
}];
export const Celsius: [string, TemperatureUnit] = ["degC", {
  scale: Expr.from(1),
  translate: Expr.from(nratio(5463, 20)),
}];
export const Fahrenheit: [string, TemperatureUnit] = ["degF", {
  scale: Expr.from(nratio(5, 9)),
  translate: Expr.from(nratio(45967, 180)),
}];
export const Rankine: [string, TemperatureUnit] = ["degR", {
  scale: Expr.from(nratio(5, 9)),
  translate: Expr.from(0),
}];

export function convert(unit1: TemperatureUnit, unit2: TemperatureUnit, value: Expr): Expr {
  const k = Compound.binAdd(Compound.binMul(unit1.scale, value), unit1.translate);
  return Compound.binDiv(Compound.binSub(k, unit2.translate), unit2.scale);
}

export function toRelativeUnit(name: string, unit: TemperatureUnit): Unit {
  return Unit.simple(name, Dimension.SimpleDim.Temperature, unit.scale);
}

///// Function for absolute temp conversions
