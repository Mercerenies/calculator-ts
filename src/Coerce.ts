
import Expr from './Expr'
import Numeral from './Numerical/Numeral'

export function toInteger(expr: Expr | Numeral): bigint | null {
  if (expr instanceof Expr) {
    let result: bigint | null = null;
    expr.ifNumber(function(n) {
      result = toInteger(n);
    });
    return result;
  } else {
    return expr.dispatch(
      function(r) {
        if (r.den === BigInt(1))
          return r.num;
        return null;
      },
      function(f) {
        if (f.value == Math.floor(f.value))
          return BigInt(f.value);
        return null;
      },
      function(c) {
        if (c.imag == 0 && c.real == Math.floor(c.real))
          return BigInt(c.real);
        return null;
      }
    );
  }
}
