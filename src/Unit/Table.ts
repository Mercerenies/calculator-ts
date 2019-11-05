
import Dimension from './Dimension'
import Unit from './Unit'
import * as Temp from './Temperature'
import Expr from '../Expr'
import * as Compound from '../Compound'
import { nratio } from '../Numerical/Numeral'

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

function addUnit(name: string, unit: Unit): void {
  table!.set(name, unit);
}

function addUnits(many: [string, Unit][]): void {
  for (const [s, u] of many) {
    addUnit(s, u);
  }
}

// Note: A lot of the measurements in the following function are from
// the Emacs Calc units table.

function initTable(): void {
  if (table === null) {
    table = new Map<string, Unit>();

    // Angular
    addUnit("rad", Unit.base("rad", SimpleDim.Angle));
    addUnit("deg", Unit.simple("deg", SimpleDim.Angle,
                               new Expr("/", [Expr.from("pi"), Expr.from(180)])));

    // Length
    addUnits(expandSIPrefixes("m", Unit.base("m", SimpleDim.Length)));
    addUnit("in", Unit.simple("in", SimpleDim.Length, Expr.from(nratio(254, 10000))));
    addUnit("ft", Unit.simple("ft", SimpleDim.Length, Expr.from(nratio(3048, 10000))));
    addUnit("yd", Unit.simple("yd", SimpleDim.Length, Expr.from(nratio(9144, 10000))));
    addUnit("mi", Unit.simple("mi", SimpleDim.Length, Expr.from(nratio(1609344, 1000))));
    addUnit("au", Unit.simple("au", SimpleDim.Length, Expr.from(BigInt('149597870700'))));
    addUnit("lyr", Unit.simple("lyr", SimpleDim.Length,
                               Expr.from(BigInt('9460730472580800'))));
    addUnit("pc", Unit.simple("pc", SimpleDim.Length,
                              new Expr("/", [Expr.from(BigInt('96939420213600000')),
                                             Expr.from('pi')])));

    // Time
    addUnits(expandSIPrefixes("s", Unit.base("s", SimpleDim.Time)));
    addUnit("sec", Unit.base("sec", SimpleDim.Time)); // sec == s
    addUnit("min", Unit.simple("min", SimpleDim.Time, Expr.from(60)));
    addUnit("hr", Unit.simple("hr", SimpleDim.Time, Expr.from(3600)));
    addUnit("day", Unit.simple("day", SimpleDim.Time, Expr.from(86400)));
    addUnit("wk", Unit.simple("wk", SimpleDim.Time, Expr.from(604800)));
    addUnit("yr", Unit.simple("yr", SimpleDim.Time, Expr.from(31557600)));

    // Temperature
    const t = (t: [string, Temp.Unit]) => Temp.toRelativeUnit(t[0], t[1]);
    addUnit(Temp.Kelvins[0], t(Temp.Kelvins));
    addUnit(Temp.Celsius[0], t(Temp.Celsius));
    addUnit(Temp.Fahrenheit[0], t(Temp.Fahrenheit));
    addUnit(Temp.Rankine[0], t(Temp.Rankine));

    // Volume
    addUnit("L", table!.get("dm")!.pow(BigInt(3)).rename("L"));

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
