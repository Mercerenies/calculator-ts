
import Expr from '../Expr'
import { Function } from '../Function/Function'
import { StandardLibrary } from '../Function/Library'
import * as Compound from '../Compound'

export const DerivativeFunctionName = "D";

function unknownDeriv(expr: Expr, variable: string): Expr {
  return new Expr(DerivativeFunctionName, [expr, Expr.from(variable)]);
}

export function derivative(expr: Expr, variable: string): Expr {
  return expr.dispatch(
    () => Expr.from(0), // Derivative of a constant is zero
    (v) => Expr.from(v == variable ? 1 : 0), // Derivative of a variable is either zero or one
    function(head, tail) {
      switch (head) {
        case "+":

          return new Expr("+", tail.map((t) => derivative(t, variable)));

        case "-":

          return new Expr("-", tail.map((t) => derivative(t, variable)));

        case "*": {
          // Product Rule: (f g)' = f g' + f' g
          // (Written in more generality here for n-fold products)

          const summands: Expr[] = [];
          for (let i = 0; i < tail.length; i++) {
            const dup = tail.slice();
            dup[i] = derivative(dup[i], variable);
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
          const numd = derivative(num, variable);
          const dend = derivative(den, variable);

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
          const based = derivative(base, variable);
          const expd = derivative(exp, variable);

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

        default:
          // Unknown derivative.
          return unknownDeriv(expr, variable);
      }
    },
  );
}
