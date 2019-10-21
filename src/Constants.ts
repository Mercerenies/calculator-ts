
import Numeral, { numeral } from './Numerical/Numeral'
import Floating, { floating } from './Numerical/Floating'
import Complex, { complex } from './Numerical/Complex'

export interface ConstProps {
  readonly name: string;
  readonly value: Numeral;
  readonly isExact: boolean;
}

function compileConsts(iter: Iterable<ConstProps>): Map<string, ConstProps> {
  const m = new Map<string, ConstProps>();
  for (const i of iter) {
    m.set(i.name, i);
  }
  return m;
}

const constants = compileConsts([
  { name: "pi", value: numeral(floating(Math.PI)), isExact: false },
  { name: "e" , value: Numeral.one().exp()       , isExact: false },
  { name: "i" , value: numeral(complex(0, 1))    , isExact: false }, // TODO Is this exact?
]);

export function getConst(name: string): ConstProps | undefined {
  return constants.get(name);
}
