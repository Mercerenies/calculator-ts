
import { Function } from './Function'
import FunctionBuilder from './Builder'
import Unit from '../Unit/Unit'
import * as Temp from '../Unit/Temperature'
import * as Table from '../Unit/Table'
import { ParseResult, parseUnits, parseTempUnits } from '../Unit/Parse'
import Expr from '../Expr'
import * as Compound from '../Compound'

function convertUnits<T>(args: Expr[]): Expr | null {

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

function convertTempUnits<T>(args: Expr[]): Expr | null {

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
  const fromUnit = parseTempUnits(ufrom);
  const toUnit = parseTempUnits(uto);

  if (fromUnit === null || toUnit === null)
    return null;

  const value1 = Compound.binDiv(
    Compound.binMul(value, Expr.from(fromUnit.coefficient)),
    Expr.from(toUnit.coefficient)
  );
  const result = Temp.convert(fromUnit.unit[1], toUnit.unit[1], value1);

  if (expandresult && (result !== null)) {
    return new Expr("*", [result, Expr.from(toUnit.unit[0])]);
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
