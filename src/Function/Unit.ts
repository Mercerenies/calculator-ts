
import { Function } from './Function'
import FunctionBuilder from './Builder'
import Unit from '../Unit/Unit'
import * as Table from '../Unit/Table'
import { parseUnits } from '../Unit/Parse'
import Expr from '../Expr'
import * as Compound from '../Compound'

function convertUnits(args: Expr[]): Expr | null {

  let expandresult = false;
  if (args.length === 2) {
    args = [Expr.from(1), ...args];
    // If we're given two arguments to start with, the units are
    // integrated in with the number, so provide the answer in the
    // same format.
    expandresult = true;
  }

  if (args.length !== 3)
    return null;

  const [value, ufrom, uto] = args;
  const fromUnit = parseUnits(ufrom);
  const toUnit = parseUnits(uto);

  if (fromUnit === null || toUnit === null)
    return null;

  const value1 = Compound.binDiv(
    Compound.binMul(value, Expr.from(fromUnit.coefficient)),
    Expr.from(toUnit.coefficient)
  );
  const result = Unit.convert(fromUnit.unit, toUnit.unit, value1);

  if (expandresult && (result !== null)) {
    return new Expr("*", [result, toUnit.unit.nameAsExpr()]);
  } else {
    return result;
  }

}

export const uconvert: Function =
  new FunctionBuilder({
    name: "uconvert",
    eval: convertUnits
  })
  .freeze();
