
import Expr from '../Expr'
import { Mode } from '../Mode'

// For debugging purposes
//import LispLikePrinter from '../Printer/LispLikePrinter'
//import { print } from '../Printer'

export interface Pass {
  (expr: Expr, mode: Mode): Expr;
}

export function id(expr: Expr): Expr {
  return expr;
}

export function compose(passes: Pass[]): Pass {
  return function(e, m) {
    for (const p of passes) {
      e = p(e, m);
    }
    return e;
  };
}

export function runPassOnceTD(pass: Pass, expr: Expr, mode: Mode): Expr {
  expr = pass(expr, mode);
  expr.ifCompound(function(head, tail) {
    expr = new Expr(head, tail.map(function (t) {
      return runPassOnceTD(pass, t, mode);
    }));
  });
  return expr;
}

export function runPassOnceBU(pass: Pass, expr: Expr, mode: Mode): Expr {
  expr.ifCompound(function(head, tail) {
    expr = new Expr(head, tail.map(function (t) {
      return runPassOnceBU(pass, t, mode);
    }));
  });
  expr = pass(expr, mode);
  return expr;
}

function runPass(pass: Pass, expr: Expr, mode: Mode,
                 iter: (pass: Pass, expr: Expr, mode: Mode) => Expr,
                 max: number = Infinity): Expr {
  for (let i = 0; i < max; i++) {
    const expr1 = iter(pass, expr, mode);
    if (expr1.eq(expr))
      return expr;
    expr = expr1;
  }
  // TODO Remove this warning; I just want it here for debugging
  console.warn(`Exceeded ${max} pass limit!`);
  return expr;
}

export function runPassTD(pass: Pass, expr: Expr, mode: Mode, max: number = Infinity): Expr {
  return runPass(pass, expr, mode, runPassOnceTD, max);
}

export function runPassBU(pass: Pass, expr: Expr, mode: Mode, max: number = Infinity): Expr {
  return runPass(pass, expr, mode, runPassOnceBU, max);
}
