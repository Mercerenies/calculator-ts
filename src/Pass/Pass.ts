
import Expr from '../Expr'

export interface Pass {
  (expr: Expr): Expr;
}

export function id(expr: Expr): Expr {
  return expr;
}

export function compose(passes: Pass[]): Pass {
  return function(e) {
    for (const p of passes) {
      e = p(e);
    }
    return e;
  };
}

export function runPassOnceTD(pass: Pass, expr: Expr): Expr {
  expr = pass(expr);
  expr.ifCompound(function(head, tail) {
    expr = new Expr(head, tail.map(function (t) {
      return runPassOnceTD(pass, t);
    }));
  });
  return expr;
}

export function runPassOnceBU(pass: Pass, expr: Expr): Expr {
  expr.ifCompound(function(head, tail) {
    expr = new Expr(head, tail.map(function (t) {
      return runPassOnceBU(pass, t);
    }));
  });
  expr = pass(expr);
  return expr;
}

/*
function runPass(pass: Pass, expr: Expr,
                 iter: (pass: Pass, expr: Expr) => Expr,
                 max: number = Infinity): Expr {
  for (let i = 0; i < max; i++) {
    const expr1 = iter(pass, expr);
  }
}
*/
