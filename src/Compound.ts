
import Expr from './Expr'

// Miscellaneous helper functions for common use cases with compound
// expressions.

export function add(args: Expr[]): Expr {
  if (args.length == 0)
    return Expr.from(0);
  else if (args.length == 1)
    return args[0];
  else
    return new Expr("+", args);
}

export function mul(args: Expr[]): Expr {
  if (args.length == 0)
    return Expr.from(1);
  else if (args.length == 1)
    return args[0];
  else
    return new Expr("*", args);
}
