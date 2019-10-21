
import Expr from '../Expr'
import Shape from '../Shape'
import { Mode, ExactnessMode } from '../Mode'
import * as Compound from '../Compound'
import { sortToNum, noop } from '../Util'

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

export function flattenNestedExponents(expr: Expr): Expr {
  // (a^b)^c ==> a^(b*c)
  expr.ifCompoundHeadN("^", 2, function([ab, c]) {
    ab.ifCompoundHeadN("^", 2, function([a, b]) {
      expr = new Expr("^", [a, new Expr("*", [b, c])]);
    });
  });
  return expr;
}

export function flattenSingletons(expr: Expr, ops: string[]): Expr {
  // +(x) ==> x
  expr.ifCompoundN(1, function(head, [b]) {
    if (ops.includes(head))
      expr = b;
  });
  return expr;
}

export function flattenStdSingletons(expr: Expr): Expr {
  return flattenSingletons(expr, ["+", "*"]);
}

export function flattenNullaryOps(expr: Expr, ops: Map<string, Expr>): Expr {
  // +() ==> 0
  // *() ==> 1
  expr.ifCompoundN(0, function(head, []) {
    const e = ops.get(head);
    if (e !== undefined)
      expr = e;
  });
  return expr;
}

export function flattenStdNullaryOps(expr: Expr): Expr {
  return flattenNullaryOps(expr, new Map([["+", Expr.from(0)], ["*", Expr.from(1)]]));
}

export function sortTermsAdditive(expr: Expr): Expr {
  expr.ifCompoundHead("+", function(tail) {
    const newtail = tail.slice();
    newtail.sort((a, b) => sortToNum(a.lexCmp(b)));
    expr = new Expr("+", newtail);
  });
  return expr;
}

export function sortTermsMultiplicative(expr: Expr): Expr {
  expr.ifCompoundHead("*", function(tail) {

    if (tail.filter((t) => !Shape.multiplicationCommutes(Shape.of(t))).length > 1)
      // We can safely commute multiplication if there is at most one
      // operand for which the commutativity fails. If there are two
      // or more, leave it be. We allow there t obe one so that e.g.,
      // scalars will commute around a single matrix to create a nicer
      // standard form.
      return;

    const newtail = tail.slice();
    newtail.sort((a, b) => sortToNum(a.lexCmp(b)));
    expr = new Expr("*", newtail);

  });
  return expr;
}

export function promoteRatios(expr: Expr, mode: Mode): Expr {
  if (mode.exactness <= ExactnessMode.Floating) {
    expr.ifNumber(function(x) {
      x.dispatch(
        function(r) {
          expr = Expr.from(r.toFloating());
        },
        noop,
        noop,
      );
    });
  }
  return expr;
}
