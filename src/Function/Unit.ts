
import { Function } from './Function'
import FunctionBuilder from './Builder'
import Unit from '../Unit/Unit'
import Dimension from '../Unit/Dimension'
import * as Table from '../Unit/Table'
import Expr from '../Expr'

function convertUnits(args: Expr[]): Expr | null {
  if (args.length !== 3)
    return null;

  const [value, ufrom, uto] = args;
  let fromUnit: Unit | undefined = undefined;
  let toUnit: Unit | undefined = undefined;

  ufrom.ifVar((s) => {
    fromUnit = Table.lookupUnit(s);
  });
  uto.ifVar((s) => {
    toUnit = Table.lookupUnit(s);
  });
  if (fromUnit === undefined || toUnit === undefined)
    return null;

  return Unit.convert(fromUnit, toUnit, value);

}

export const uconvert: Function =
  new FunctionBuilder({
    name: "uconvert",
    eval: convertUnits
  })
  .freeze();
