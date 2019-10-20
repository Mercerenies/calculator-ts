
import Expr from '../Expr'
import * as Compound from '../Compound'
import { FactorProps, factorPass } from '../Algebra/Factoring'
import { Mode } from '../Mode'
import Shape from '../Shape'

export const MultiplicationFactor: FactorProps = {
  head: "*",

  match(expr: Expr): [Expr, Expr] | null {
    return expr.dispatch(
      () => null, // Constant
      () => [expr, Expr.from(1)], // Variable
      function(head, tail) { // Compound
        if ((head == "^") && (tail.length == 2)) {
          if (tail[0].isVar())
            return [tail[0], tail[1]];
        }
        return null;
      }
    );
  },

  coalesce(base: Expr, count: Expr[]): Expr {
    if ((count.length == 1) && (count[0].eq(Expr.from(1))))
      return base;
    return new Expr("^", [base, Compound.add(count)]);
  },

  finalize(body: Expr[]): Expr {
    return Compound.mul(body);
  },

}

export const AdditionFactor: FactorProps = {
  head: "+",

  match(expr: Expr): [Expr, Expr] | null {
    return expr.dispatch(
      () => null, // Constant
      () => [expr, Expr.from(1)], // Variable
      function(head, tail) { // Compound
        if ((head == "*") && (tail.length == 2)) {
          if (tail[0].isVar() && tail[1].isNumber())
            return [tail[0], tail[1]];
          if (tail[1].isVar() && tail[0].isNumber())
            return [tail[1], tail[0]];
        }
        return null;
      }
    );
  },

  coalesce(base: Expr, count: Expr[]): Expr {
    if ((count.length == 1) && (count[0].eq(Expr.from(1))))
      return base;
    return new Expr("*", [Compound.add(count), base]);
  },

  finalize(body: Expr[]): Expr {
    return Compound.add(body);
  },

}

export function collectLikeFactors(expr: Expr, mode: Mode): Expr {
  let disabled = false;
  expr.ifCompoundHead("*", function(tail) {
    if (!tail.every((e) => Shape.multiplicationCommutes(Shape.of(e, mode.vector))))
      disabled = true;
  });
  if (disabled)
    return expr;
  return factorPass(expr, MultiplicationFactor);
}

export function collectLikeTerms(expr: Expr): Expr {
  return factorPass(expr, AdditionFactor);
}

// TODO collectFactorsFromDenom
