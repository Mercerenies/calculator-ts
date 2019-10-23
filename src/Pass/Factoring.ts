
import Expr from '../Expr'
import * as Compound from '../Compound'
import { FactorProps, factorPass } from '../Algebra/Factoring'
import { Mode } from '../Mode'
import Shape from '../Shape'
import { MapMerge, mergeOrd } from '../Merge'
import { sortToNum } from '../Util'

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

  finalize(leftovers: Expr[], matches: Expr[]): Expr {
    return Compound.mul(leftovers.concat(matches));
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

  finalize(leftovers: Expr[], matches: Expr[]): Expr {
    return Compound.add(leftovers.concat(matches));
  },

}

// export function FracMultiplicationFactor(): FactorProps & { result: [Expr[], Expr[]] } {
//   const obj = Object.create(MultiplicationFactor);

//   let result: [Expr[], Expr[]] = [[], []];

//   obj.finalize = function(leftovers: Expr[], matches: Expr[]) {
//     result = [leftovers, matches];
//     return MultiplicationFactor.finalize.call(this, leftovers, matches);
//   };

//   Object.defineProperty(obj, 'result', { get() { return result; } });

//   return obj;
// }

// Used in collectFactorsFromDenom to recognize obviously negative
// exponents and moves them to the opposite side of the fraction bar.
function shouldBeFlipped(expr: Expr[]): Expr | null {
  let result: Expr | null = null
  if (expr.length == 1) {
    expr[0].ifNumber(function(n) {
      if (n.isNegative()) {
        result = new Expr("_", [expr[0]]);
      }
    });
  }
  return result;
};

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

export function collectFactorsFromDenom(expr: Expr, mode: Mode): Expr {
  // So in the ideal world, we'd have a FactorProps for this one too,
  // but the FactorProps algorithm is not general enough to handle
  // this use case, and generalizing it to only be used here is
  // unnecessarily cumbersome. So instead we just reimplement the
  // parts of that algorithm that we need here, tweaking as necessary
  // to handle the denominator part.

  const props = MultiplicationFactor;

  expr.ifCompoundHeadN("/", 2, function([num, den]) {
    const numt = Compound.termsOf("*", num);
    const dent = Compound.termsOf("*", den);

    if (!(numt.concat(dent)).every((e) => Shape.multiplicationCommutes(Shape.of(e, mode.vector))))
      return; // Not commutative so ignore.

    const numleft: Expr[] = [];
    const nummatched: [Expr, Expr[]][] = [];
    for (const t of numt) {
      const result = props.match(t);
      if (result === null) {
        numleft.push(t);
      } else {
        let found = false;
        for (const m of nummatched) {
          if (m[0].eq(result[0])) {
            m[1].push(result[1]);
            found = true;
            break;
          }
        }
        if (!found)
          nummatched.push([result[0], [result[1]]]);
      }
    }

    const denleft: Expr[] = [];
    const denmatched: [Expr, Expr[]][] = [];
    for (const t of dent) {
      const result = props.match(t);
      if (result === null) {
        denleft.push(t);
      } else {
        let found = false;
        for (const m of denmatched) {
          if (m[0].eq(result[0])) {
            m[1].push(result[1]);
            found = true;
            break;
          }
        }
        if (!found)
          denmatched.push([result[0], [result[1]]]);
      }
    }

    nummatched.sort((a, b) => sortToNum(a[0].lexCmp(b[0])));
    denmatched.sort((a, b) => sortToNum(a[0].lexCmp(b[0])));

    const nummatched1: [Expr, Expr[]][] = [];
    const denmatched1: [Expr, Expr[]][] = [];

    const classifier: MapMerge<Expr, Expr[], Expr[], void> = {
      lhsOnly(key, value) {
        // A term which only appears in the numerator.
        const flipped = shouldBeFlipped(value);
        if (flipped)
          denmatched1.push([key, [flipped]]);
        else
          nummatched1.push([key, value]);
      },
      rhsOnly(key, value) {
        // A term which only appears in the denominator.
        const flipped = shouldBeFlipped(value);
        if (flipped)
          nummatched1.push([key, [flipped]]);
        else
          denmatched1.push([key, value]);
      },
      both(key, value1, value2) {
        // A term which appears in both
        nummatched1.push([key, [new Expr("-", [Compound.add(value1), Compound.add(value2)])]]);
      },
    };
    mergeOrd(classifier,
             (a, b) => a.lexCmp(b),
             nummatched,
             denmatched);

    const finalnum = props.finalize(numleft, nummatched1.map(([b, c]) => props.coalesce(b, c)));
    const finalden = props.finalize(denleft, denmatched1.map(([b, c]) => props.coalesce(b, c)));
    expr = new Expr("/", [finalnum, finalden])

  });

  return expr;
}
