
import Expr from '../Expr'
import Numeral from '../Numerical/Numeral'
import * as Coerce from '../Coerce'
import * as Compound from '../Compound'
import Unit from './Unit'
import * as Temp from './Temperature'
import { lookupUnit, lookupTempUnit } from './Table'

export interface ParseResult<T> {
  unit: T;
  coefficient: Numeral;
}

export function parseUnits(
  expr: Expr,
  lookup: (name: string) => Unit | undefined = lookupUnit
): ParseResult<Unit> | null {
  return expr.dispatch(
    function(n) {
      return {
        unit: Unit.empty(),
        coefficient: n,
      };
    },
    function(v) {
      const unit = lookup(v);
      if (unit === undefined)
        return null;
      return {
        unit: unit,
        coefficient: Numeral.one(),
      };
    },
    function(head, args) {
      switch (head) {
        case "*": {
          let acc = { unit: Unit.empty(), coefficient: Numeral.one() };
          for (const e of args) {
            const e1 = parseUnits(e, lookup);
            if (e1 === null)
              return null;
            acc = {
              unit: acc.unit.mul(e1.unit),
              coefficient: acc.coefficient.mul(e1.coefficient),
            };
          }
          return acc;
        }
        case "/": {
          if (args.length !== 2)
            return null;
          const [n, d] = args;
          const n1 = parseUnits(n, lookup);
          const d1 = parseUnits(d, lookup);
          if (n1 === null || d1 === null)
            return null;
          return {
            unit: n1.unit.div(d1.unit),
            coefficient: n1.coefficient.div(d1.coefficient),
          };
        }
        case "^": {
          if (args.length !== 2)
            return null;
          const [b, e] = args;
          const exp = Coerce.toInteger(e);
          if (exp === null)
            return null;
          const base = parseUnits(b, lookup);
          if (base === null)
            return null;
          return {
            unit: base.unit.pow(exp),
            coefficient: base.coefficient.pow(Numeral.fromInt(exp)),
          };
        }
        default:
          // Can't handle it
          return null;
      }
    },
  );
}

export function parseTempUnits(e: Expr): ParseResult<[string, Temp.Unit]> | null {
  return e.dispatch(
    () => null, // Scalars have dimension zero and are not
                // temperatures.
    function(s) {
      // In the case of a string, look it up.
      const temp = lookupTempUnit(s);
      if (temp === undefined)
        return null;
      return {
        unit: [s, temp],
        coefficient: Numeral.one(),
      };
    },
    function(head, args) {
      switch (head) {
        case "*": {
          if (args.length !== 2)
            return null;
          const [a, b] = args;
          // We require that one piece be a scalar and the other a
          // temperature unit.
          let scalar: Numeral | null = null;
          let unit: string | null = null;
          a.ifNumber(function(a) { scalar = a; });
          b.ifNumber(function(b) { scalar = b; });
          if (scalar === null)
            return null;
          a.ifVar(function(a) { unit = a; });
          b.ifVar(function(b) { unit = b; });
          if (unit === null)
            return null;
          const unit1 = lookupTempUnit(unit);
          if (unit1 === undefined)
            return null;
          const scalar1: Numeral = scalar;
          return {
            unit: [unit, unit1],
            coefficient: scalar1,
          };
        }
        case "/": {
          if (args.length !== 2)
            return null;
          const [n, d] = args;
          // We require that the numerator be a unit and the
          // denominator a scalar.
          let scalar: Numeral | null = null;
          let unit: string | null = null;
          d.ifNumber(function(a) { scalar = a; });
          if (scalar === null)
            return null;
          n.ifVar(function(a) { unit = a; });
          if (unit === null)
            return null;
          const unit1 = lookupTempUnit(unit);
          if (unit1 === undefined)
            return null;
          const scalar1: Numeral = scalar;
          return {
            unit: [unit, unit1],
            coefficient: scalar1.recip(),
          };
        }
        default:
          // Can't handle it. Note, in particular, that we don't deal
          // with exponents, as those would change the dimension and
          // this is strictly a one-dimensional conversion.
          return null;
      }
    },
  );
}
