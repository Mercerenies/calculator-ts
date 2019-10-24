
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
    Trig.sin,
  ]);
