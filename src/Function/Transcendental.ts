
import { Function } from './Function'
import FunctionBuilder from './Builder'
import Expr from '../Expr'
import { numeral } from '../Numerical/Numeral'
import { ratio } from '../Numerical/Ratio'
import { ExactnessMode } from '../Mode'

export const log: Function =
  FunctionBuilder.simpleUnary(
    "log",
    function(n) {
      return n.ln();
    }
  )
  .alwaysInexact()
  .freeze();

export const exp: Function =
  FunctionBuilder.simpleUnary(
    "exp",
    function(n) {
      return n.exp();
    }
  )
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
  .freeze();

function isPerfectSquare(n: bigint): boolean {
  const d = Number(n) ** 0.5;
  return d == Math.round(d);
}
