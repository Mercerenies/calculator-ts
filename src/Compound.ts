
import Expr from './Expr'

// Miscellaneous helper functions for common use cases with compound
// expressions.

export function add(args: Expr[], base?: Expr): Expr {
  if ((base !== undefined) && (!base.eq(Expr.from(0))))
    args = args.concat([base]);
  if (args.length == 0)
    return Expr.from(0);
  else if (args.length == 1)
    return args[0];
  else
    return new Expr("+", args);
}

export function mul(args: Expr[], base?: Expr): Expr {
  if (base !== undefined) {
    if (base.eq(Expr.from(0)))
      return Expr.from(0);
    else if (!base.eq(Expr.from(1)))
      args = [base].concat(args);
  }
  if (args.length == 0)
    return Expr.from(1);
  else if (args.length == 1)
    return args[0];
  else
    return new Expr("*", args);
}

export function termsOf(head: string, expr: Expr): Expr[] {
  let result: Expr[] = [expr];
  expr.ifCompoundHead(head, function(tail) {
    result = tail;
  });
  return result;
}
