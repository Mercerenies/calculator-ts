
import Expr from './Expr'
import Numeral from './Numerical/Numeral'

// Miscellaneous helper functions for common use cases with compound
// expressions.

// add([]) = 0
// add([x]) = x
// add([x, y, z]) = (+ x y z)
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

// mul([]) = 1
// mul([x]) = x
// mul([x, y, z]) = (+ x y z)
export function mul(args: Expr[], base?: Expr): Expr {
  if (base !== undefined) {
    // TODO Careful with the 0*x = 0 optimization if x has a weird
    // shape.
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

// Handles numbers immediately but makes a new expression for
// non-numbers.
export function unOp(a: Expr,
                     head: string | ((x: Expr) => Expr),
                     op: (x: Numeral) => Numeral): Expr {
  if (typeof(head) === 'string') {
    const tmp = head;
    head = (x) => new Expr(tmp, [x]);
  }
  let result = head(a);
  a.ifNumber(function(a1) {
    result = new Expr(op(a1));
  });
  return result;
}

// Combines numbers immediately but makes a new expression for
// non-numbers.
export function binOp(a: Expr, b: Expr,
                      head: string | ((x: Expr, y: Expr) => Expr),
                      op: (x: Numeral, y: Numeral) => Numeral): Expr {
  if (typeof(head) === 'string') {
    const tmp = head;
    head = (x, y) => new Expr(tmp, [x, y]);
  }
  let result = head(a, b);
  a.ifNumber(function(a1) {
    b.ifNumber(function(b1) {
      result = new Expr(op(a1, b1));
    });
  });
  return result;
}

export function binAdd(a: Expr, b: Expr): Expr {
  return binOp(a, b, "+", (x, y) => x.add(y));
}

export function binSub(a: Expr, b: Expr): Expr {
  return binOp(a, b, "-", (x, y) => x.sub(y));
}

export function binMul(a: Expr, b: Expr): Expr {
  return binOp(a, b, "*", (x, y) => x.mul(y));
}

export function binDiv(a: Expr, b: Expr): Expr {
  return binOp(a, b, "/", (x, y) => x.div(y));
}

export function binPow(a: Expr, b: Expr): Expr {
  return binOp(a, b, "^", (x, y) => x.pow(y));
}

export function unRecip(a: Expr): Expr {
  return unOp(a, (x) => new Expr("/", [Expr.from(1), x]), (x) => x.recip());
}
