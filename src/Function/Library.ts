
import { Function } from './Function'
import * as Trig from './Trigonometry'

function compileFns(iter: Iterable<Function>): Map<string, Function> {
  const m = new Map<string, Function>();
  for (const i of iter) {
    m.set(i.name, i);
  }
  return m;
}

export const StandardLibrary: Map<string, Function> =
  compileFns([
    Trig.sin, Trig.cos, Trig.tan, Trig.csc, Trig.sec, Trig.cot,
    Trig.sinh, Trig.cosh, Trig.tanh, Trig.csch, Trig.sech, Trig.coth,
    Trig.asin, Trig.acos, Trig.atan, Trig.acsc, Trig.asec, Trig.acot,
    Trig.asinh, Trig.acosh, Trig.atanh, Trig.acsch, Trig.asech, Trig.acoth,
  ]);
