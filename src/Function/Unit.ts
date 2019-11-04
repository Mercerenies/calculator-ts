
import { Function } from './Function'
import FunctionBuilder from './Builder'
import Unit from '../Unit/Unit'
import * as Table from '../Unit/Table'
import { parseUnits } from '../Unit/Parse'
import Expr from '../Expr'
import * as Compound from '../Compound'

function convertUnits(args: Expr[]): Expr | null {

  if (args.length === 2)
    args = [Expr.from(1), ...args];

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
  return Unit.convert(fromUnit.unit, toUnit.unit, value1);

}

export const uconvert: Function =
  new FunctionBuilder({
    name: "uconvert",
    eval: convertUnits
  })
  .freeze();
