
import Expr from '../Expr'

export function normalizeNegatives(expr: Expr): Expr {
  expr.ifCompound(function(head, tail) {
    // a - b ==> a + (-1) * b
    if ((head == "-") && (tail.length == 2)) {
      const [a, b] = tail;
      expr = new Expr("+", [a, new Expr("*", [Expr.from(-1), b])]);
    }
    // - b ===> -1 * b
    if ((head == "_") && (tail.length == 1)) {
      const [b] = tail;
      expr = new Expr("*", [Expr.from(-1), b]);
    }
  });
  return expr;
}
