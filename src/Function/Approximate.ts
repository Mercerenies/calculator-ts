
import { Function } from './Function'
import FunctionBuilder from './Builder'
import { Mode, ExactnessMode } from '../Mode'
import { FullPass, SAFETY } from '../Pass/Compiled'
import { runPassTD } from '../Pass/Pass'
import Expr from '../Expr'

export const approx: Function =
  new FunctionBuilder({
    name: "N",
    eval(args: Expr[], mode: Mode) {
      if (args.length != 1)
        return null;

      const [arg] = args;
      const mode1: Mode = Object.assign({}, mode, { exactness: ExactnessMode.Floating });
      return runPassTD(FullPass, arg, mode1, SAFETY);

    }
  })
  .freeze();
