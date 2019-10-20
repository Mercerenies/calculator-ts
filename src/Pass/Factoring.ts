
import Expr from '../Expr'
import * as Compound from '../Compound'
import { FactorProps, factorPass } from '../Algebra/Factoring'

export const MultiplicationFactor: FactorProps = {
  head: "*",

  match(expr: Expr): [Expr, Expr] | null {
    return expr.dispatch(
      () => null, // Constant
      () => [expr, Expr.from(1)], // Variable
      function(head, tail) { // Compound
        if ((head == "^") && (tail.length == 2)) {
          if (tail[0].isVar())
            return [tail[0], tail[1]];
        }
        return null;
      }
    );
    let result: [Expr, Expr] = [expr, Expr.from(1)];
    expr.ifCompoundHeadN("^", 2, function([a, b]) {
      result = [a, b];
    });
    return result;
  },

  coalesce(base: Expr, count: Expr[]): Expr {
    if ((count.length == 1) && (count[0].eq(Expr.from(1))))
      return base;
    return new Expr("^", [base, Compound.add(count)]);
  },

  finalize(body: Expr[]): Expr {
    return Compound.mul(body);
  },

}

export function collectLikeFactors(expr: Expr): Expr {
  return factorPass(expr, MultiplicationFactor);
}
