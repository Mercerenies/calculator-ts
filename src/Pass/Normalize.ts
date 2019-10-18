
import Expr from '../Expr'

export function normalizeNegatives(expr: Expr): Expr {
  // a - b ==> a + (-1) * b
  expr.ifCompoundHeadN("-", 2, function([a, b]) {
    expr = new Expr("+", [a, new Expr("*", [Expr.from(-1), b])]);
  });
  // - b ===> -1 * b
  expr.ifCompoundHeadN("_", 1, function([b]) {
    expr = new Expr("*", [Expr.from(-1), b]);
  });
  return expr;
}

export function levelOperators(expr: Expr, ops: string[]): Expr {
  // (a + b) + c ==> a + b + c
  expr.ifCompound(function(head, tail) {
    if (ops.includes(head)) {
      const newtail: Expr[] = [];
      for (const t of tail) {
        let handled = false;
        t.ifCompound(function(h1, t1) {
          if (h1 == head) {
            handled = true;
            newtail.push(...t1);
          }
        });
        if (!handled)
          newtail.push(t);
      }
      expr = new Expr(head, newtail);
    }
  });
  return expr;
}

export function levelStdOperators(expr: Expr): Expr {
  return levelOperators(expr, ["+", "*"]);
}

export function simplifyRationals(expr: Expr): Expr {
  /////
  // This is three very similar passes bundled into one.

  // (a/b)/c ==> a/(bc)
  expr.ifCompoundHeadN("/", 2, function([ab, c]) {
    ab.ifCompoundHeadN("/", 2, function([a, b]) {
      return new Expr("/", [a, new Expr("*", [b, c])]);
    });
  });

  // a/(b/c) ==> (ca)/b
  expr.ifCompoundHeadN("/", 2, function([a, bc]) {
    bc.ifCompoundHeadN("/", 2, function([b, c]) {
      return new Expr("/", [new Expr("*", [c, a]), b]);
    });
  });

  return expr;
}
