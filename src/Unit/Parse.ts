
import Expr from '../Expr'
import Numeral from '../Numerical/Numeral'
import * as Coerce from '../Coerce'
import * as Compound from '../Compound'
import Unit from './Unit'
import { lookupUnit } from './Table'

export interface ParseResult {
  unit: Unit;
  coefficient: Numeral;
}

export function parseUnits(
  expr: Expr,
  lookup: (name: string) => Unit | undefined = lookupUnit
): ParseResult | null {
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
