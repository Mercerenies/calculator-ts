
import Expr from '../Expr'
import { Mode, ExactnessMode } from '../Mode'
import Shape from '../Shape'
import { Function } from './Function'
import Numeral from '../Numerical/Numeral'

export default class FunctionBuilder implements Function {
  readonly name: string;
  eval: (args: Expr[], mode: Mode) => Expr | null;
  derivative: (arg: number, args: Expr[], mode: Mode) => Expr | null;
  shape: (args: Expr[], mode: Mode) => Shape;

  constructor(args: PartialFunction) {
    this.name = args.name;
    this.eval = args.eval;
    this.derivative = args.derivative || (() => null);
    this.shape = args.shape || (() => Shape.Unknown);
  }

  withDeriv(deriv: (arg: number, args: Expr[], mode: Mode) => Expr | null): FunctionBuilder {
    return new FunctionBuilder(Object.assign({}, this, { derivative: deriv }));
  }

  withShape(shape: (args: Expr[], mode: Mode) => Expr | null): FunctionBuilder {
    return new FunctionBuilder(Object.assign({}, this, { shape: shape }));
  }

  withUnaryDeriv(deriv: (arg: Expr, mode: Mode) => Expr | null): FunctionBuilder {
    return this.withDeriv(function(n, args, mode) {
      if (n != 0)
        return null;
      if (args.length != 1)
        return null;
      return deriv(args[0], mode);
    });
  }

  freeze(): Function {
    return this;
  }

  alwaysInexact(): FunctionBuilder {
    const ev = (args: Expr[], mode: Mode) => {
      if (mode.exactness >= ExactnessMode.Symbolic)
        return null;
      return this.eval(args, mode);
    };
    return new FunctionBuilder(Object.assign({}, this, { eval: ev }));
  }

  static simpleUnary(name: string, f: (n: Numeral) => Numeral | null): FunctionBuilder {
    return new FunctionBuilder({
      name: name,
      eval(args: Expr[], mode: Mode): Expr | null {
        if (args.length != 1)
          return null;
        let result: Numeral | null = null;
        args[0].ifNumber(function(n) {
          result = f(n);
        });
        if (result === null)
          return null;
        return Expr.from(result);
      }
    });
  }

  static simpleBinary(name: string, f: (a: Numeral, b: Numeral) => Numeral | null): FunctionBuilder {
    return new FunctionBuilder({
      name: name,
      eval(args: Expr[], mode: Mode): Expr | null {
        if (args.length != 2)
          return null;
        let result: Numeral | null = null;
        args[0].ifNumber(function(a) {
          args[1].ifNumber(function(b) {
            result = f(a, b);
          });
        });
        if (result === null)
          return null;
        return Expr.from(result);
      }
    });
  }

}

export interface PartialFunction {
  readonly name: string;
  eval: (args: Expr[], mode: Mode) => Expr | null;
  derivative?: (arg: number, args: Expr[], mode: Mode) => Expr | null;
  shape?: (args: Expr[], mode: Mode) => Shape;
}
