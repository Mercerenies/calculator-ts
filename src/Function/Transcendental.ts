
import { Function } from './Function'
import FunctionBuilder, * as B from './Builder'
import Expr from '../Expr'
import { numeral } from '../Numerical/Numeral'
import { ratio } from '../Numerical/Ratio'
import { ExactnessMode } from '../Mode'
import Shape from '../Shape'

export const log: Function =
  FunctionBuilder.simpleUnary(
    "log",
    function(n) {
      return n.ln();
    }
  )
  .withDeriv(B.Unary((x) => new Expr("/", [Expr.from(1), x])))
  .withShape(B.Always(Shape.Scalar))
  .alwaysInexact()
  .freeze();

export const exp: Function =
  FunctionBuilder.simpleUnary(
    "exp",
    function(n) {
      return n.exp();
    }
  )
  .withDeriv(B.Unary((x) => new Expr("exp", [x]))) // The easy derivative :)
  .withShape(B.Always(Shape.Scalar))
  .alwaysInexact()
  .freeze();

// Yes, this function is very much not transcendental, but I don't
// know where else to put it, and it's conceptually kind of like
// exp(...) and ln(...), so meh.
export const sqrt: Function =
  FunctionBuilder.simpleUnary(
    "sqrt",
    function(n, mode) {

      const defaultBehavior = function() {
        if (mode.exactness < ExactnessMode.Symbolic)
          return n.pow(numeral(ratio(1, 2)));
        else
          return null;
      };

      return n.dispatch(
        function(r) {
          if (isPerfectSquare(r.num) && isPerfectSquare(r.den)) {
            return numeral(ratio(Math.round(Number(r.num) ** 0.5),
                                 Math.round(Number(r.den) ** 0.5)));
          } else {
            return defaultBehavior();
          }
        },
        defaultBehavior,
        defaultBehavior,
      );

    }
  )
  .withDeriv(B.Unary((x) => new Expr("/", [
                              Expr.from(1),
                              new Expr("*", [Expr.from(2), new Expr("sqrt", [x])])
                            ])))
  .withShape(B.Always(Shape.Scalar)) // There may be some point in the
                                     // future when we calculate sqrt of a
                                     // matrix, but that day is not today.
  .freeze();

function isPerfectSquare(n: bigint): boolean {
  const d = Number(n) ** 0.5;
  return d == Math.round(d);
}
