
import Dimension from './Dimension'
import Unit from './Unit'
import Expr from '../Expr'
import * as Compound from '../Compound'

const SimpleDim = Dimension.SimpleDim; // Alias for brevity

// Lazy initialized when you first request it
let table: Map<string, Unit> | null = null;

const siPrefixes: [string, number][] = [
  ["Y",  24],
  ["Z",  21],
  ["E",  18],
  ["P",  15],
  ["T",  12],
  ["G",   9],
  ["M",   6],
  ["k",   3],
  ["h",   2],
  ["D",   1],
  ["" ,   0],
  ["d",  -1],
  ["c",  -2],
  ["m",  -3],
  ["u",  -6],
  ["μ",  -6],
  ["n",  -9],
  ["p", -12],
  ["f", -15],
  ["a", -18],
  ["z", -21],
  ["y",  -2],
];

function expandSIPrefixes(name: string, unit: Unit): [string, Unit][] {
  const result: [string, Unit][] = [];
  for (const [prefix, value] of siPrefixes) {
    const exponent = Compound.binPow(Expr.from(10), Expr.from(value));
    result.push([ prefix + name, unit.rename(prefix + name).scal(exponent) ]);
  }
  return result;
}

function addUnits(name: string, unit: Unit): void;
function addUnits(many: [string, Unit][]): void;
function addUnits(arg1: string | [string, Unit][], arg2?: Unit): void {
  if (typeof arg1 === 'string') {
    table!.set(arg1, arg2!);
  } else {
    for (const [s, u] of arg1) {
      addUnits(s, u);
    }
  }
}

function initTable(): void {
  if (table === null) {
    table = new Map<string, Unit>();

    // Length
    addUnits(expandSIPrefixes("m", Unit.base("m", SimpleDim.Length)));

    // TODO Lots more units

  }
}

function getTable(): Map<string, Unit> {
  initTable();
  return table!;
}

export function lookupUnit(name: string): Unit | undefined {
  return getTable().get(name);
}
