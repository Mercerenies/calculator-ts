
import Expr from '../Expr'
import { Function } from '../Function/Function'
import { StandardLibrary } from '../Function/Library'
import { Mode } from '../Mode'
import * as Compound from '../Compound'

export const DerivativeFunctionName = "D";

function unknownDeriv(expr: Expr, variable: string): Expr {
  return new Expr(DerivativeFunctionName, [expr, Expr.from(variable)]);
}

export function derivative(expr: Expr,
                           variable: string,
                           mode: Mode,
                           library: Map<string, Function> = StandardLibrary): Expr {
  const recurse = (e: Expr) => derivative(e, variable, mode, library);
  return expr.dispatch(
    () => Expr.from(0), // Derivative of a constant is zero
    (v) => Expr.from(v == variable ? 1 : 0), // Derivative of a variable is either zero or one
    function(head, tail) {
      switch (head) {
        case "+":

          return new Expr("+", tail.map(recurse));

        case "-":

          return new Expr("-", tail.map(recurse));

        case "*": {
          // Product Rule: (f g)' = f g' + f' g
          // (Written in more generality here for n-fold products)

          const summands: Expr[] = [];
          for (let i = 0; i < tail.length; i++) {
            const dup = tail.slice();
            dup[i] = recurse(dup[i]);
            summands.push(Compound.mul(dup));
          }
          return Compound.add(summands);

        }
        case "/": {
          // Quotient Rule: (f / g)' = (g f' - f g') / (g^2)

          if (tail.length !== 2) {
            // I don't know what to do in this case, as the expression
            // is likely not well-formed.
            return unknownDeriv(expr, variable);
          }

          const [num, den] = tail;
          const numd = recurse(num);
          const dend = recurse(den);

          return new Expr("/", [
            new Expr("-", [new Expr("*", [den, numd]), new Expr("*", [num, dend])]),
            new Expr("^", [den, Expr.from(2)]),
          ]);

        }
        case "^": {
          // The "general" power / exponent rule:
          // (f^g)' = f^g (f' g / f + g' ln(f))

          if (tail.length !== 2) {
            // I don't know what to do in this case, as the expression
            // is likely not well-formed.
            return unknownDeriv(expr, variable);
          }

          const [base, exp] = tail;
          const based = recurse(base);
          const expd = recurse(exp);

          return new Expr("*", [
            new Expr("^", [base, exp]),
            new Expr("+", [
              new Expr("/", [
                new Expr("*", [based, exp]),
                base,
              ]),
              new Expr("*", [
                expd,
                new Expr("ln", [base]),
              ]),
            ]),
          ]);

        }

        default: {

          const fn = library.get(head);
          if (fn !== undefined) {
            // Extended chain rule
            const summands: Expr[] = [];
            let failed = false;
            for (let i = 0; i < tail.length; i++) {
              const curr = fn.derivative(i, tail, mode)
              if (curr === null) {
                failed = true;
                break;
              }
              summands.push(Compound.mul([recurse(tail[i]), curr]));
            }
            if (!failed)
              return Compound.add(summands);
          }

          // If none of the other cases apply, then unknown.
          return unknownDeriv(expr, variable);
        }
      }
    },
  );
}
