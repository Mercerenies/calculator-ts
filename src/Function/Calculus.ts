
import { Function } from './Function'
import FunctionBuilder from './Builder'
import Expr from '../Expr'
import { derivative as cderivative, DerivativeFunctionName } from '../Calculus/Derivative'

export const derivative: Function =
  new FunctionBuilder({
    name: DerivativeFunctionName,
    eval(args: Expr[]) {
      if (args.length !== 2)
        return null;
      let result = null;
      args[1].ifVar(function(v) {
        result = cderivative(args[0], v);
      });
      return result;
    }
  })
  .freeze();
