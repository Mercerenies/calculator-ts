
import Expr from '../Expr'
import Shape from '../Shape'
import { Mode } from '../Mode'
import * as Compound from '../Compound'

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

export function simplifyRationals(expr: Expr, mode: Mode): Expr {
  // This is three related passes bundled into one.

  // (a/b)/c ==> a/(bc)
  expr.ifCompoundHeadN("/", 2, function([ab, c]) {
    ab.ifCompoundHeadN("/", 2, function([a, b]) {
      expr = new Expr("/", [a, new Expr("*", [b, c])]);
    });
  });

  // a/(b/c) ==> (ca)/b
  expr.ifCompoundHeadN("/", 2, function([a, bc]) {
    bc.ifCompoundHeadN("/", 2, function([b, c]) {
      expr = new Expr("/", [new Expr("*", [c, a]), b]);
    });
  });

  // a(b/c)d ==> (abd)/c
  expr.ifCompoundHead("*", function(ts) {
    if (!ts.some((e) => e.hasHead("/"))) {
      // If there's no division, don't bother triggering it.
      return;
    }
    if (ts.every((e) => Shape.multiplicationCommutes(Shape.of(e, mode.vector)))) {
      // If multiplication isn't commutative, then it's a dangerous
      // operation.
      return;
    }
    const num: Expr[] = [];
    const den: Expr[] = [];
    for (const e of ts) {
      e.ifCompoundHeadN("/", 2, function([a, b]) {
        // Separate fractions.
        num.push(a);
        den.push(b);
      }, function() {
        // Leave non-fractions alone in the numerator.
        num.push(e);
      });
    }
    expr = new Expr("/", [Compound.mul(num), Compound.mul(den)]);
  });

  return expr;
}
