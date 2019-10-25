
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

  withShape(shape: (args: Expr[], mode: Mode) => Shape): FunctionBuilder {
    return new FunctionBuilder(Object.assign({}, this, { shape: shape }));
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

  static simpleUnary(name: string,
                     f: (n: Numeral, mode: Mode) => Numeral | null): FunctionBuilder {
    return new FunctionBuilder({
      name: name,
      eval(args: Expr[], mode: Mode): Expr | null {
        if (args.length != 1)
          return null;
        let result: Numeral | null = null;
        args[0].ifNumber(function(n) {
          result = f(n, mode);
        });
        if (result === null)
          return null;
        return Expr.from(result);
      }
    });
  }

  static simpleBinary(name: string,
                      f: (a: Numeral, b: Numeral, mode: Mode) => Numeral | null): FunctionBuilder {
    return new FunctionBuilder({
      name: name,
      eval(args: Expr[], mode: Mode): Expr | null {
        if (args.length != 2)
          return null;
        let result: Numeral | null = null;
        args[0].ifNumber(function(a) {
          args[1].ifNumber(function(b) {
            result = f(a, b, mode);
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

// I'm capitalizing these because I want to think of them as
// "constructors" for derivative functions or shape functions. Yes,
// they're really just curried functions, but I want to think of them
// as constructors of calculator data.

export function Unary(
  deriv: (arg: Expr, mode: Mode) => Expr | null
): (arg: number, args: Expr[], mode: Mode) => Expr | null {
  return function(n, args, mode) {
    if (n != 0)
      return null;
    if (args.length != 1)
      return null;
    return deriv(args[0], mode);
  };
}

export function Always(s: () => Shape): (args: Expr[], mode: Mode) => Shape {
  // Ideally, this function would take a Shape, not a () => Shape. But
  // annoying circular dependency problems between a bunch of modules
  // forced me to do something, and this was the easiest fix. ¯\_(ツ)_/¯
  return s;
}

export function MatchFirstArg(args: Expr[], mode: Mode): Shape {
  if (args.length === 0)
    return Shape.Unknown;
  return Shape.of(args[0], mode);
}
