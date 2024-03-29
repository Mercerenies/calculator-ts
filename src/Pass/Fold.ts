
import Expr from '../Expr'
import Shape from '../Shape'
import { Mode, ExactnessMode } from '../Mode'
import * as Compound from '../Compound'
import Numeral from '../Numerical/Numeral'
import { getConst } from '../Constants'
import { StandardLibrary } from '../Function/Library'
import { tryApply } from '../Function/Function'

// TODO On these next two passes, we need to be careful about 0 * x if
// the shape of x is wonky.

export function foldConstants(expr: Expr): Expr {
  // Handles +, *, /

  expr.ifCompound(function(head, tail) {
    switch (head) {
      case "+": {
        let accum = Numeral.zero();
        const newtail = tail.filter(function(t) {
          let keep = true;
          t.ifNumber(function(n) {
            accum = accum.add(n);
            keep = false;
          });
          return keep;
        });
        expr = Compound.add(newtail, Expr.from(accum));
      }
        break;
      case "*": {
        let accum = Numeral.one();
        const newtail = tail.filter(function(t) {
          let keep = true;
          t.ifNumber(function(n) {
            accum = accum.mul(n);
            keep = false;
          });
          return keep;
        });
        expr = Compound.mul(newtail, Expr.from(accum));
      }
        break;
      case "/": {
        if (tail.length == 2) {
          const [a, b] = tail;
          // a/1 == a
          if (b.eq(Expr.from(1))) {
            expr = a;
          // 0/b == 0
          } else if (a.eq(Expr.from(0))) {
            expr = Expr.from(0);
          } else {
            a.ifNumber(function(a1) {
              b.ifNumber(function(b1) {
                expr = Expr.from(a1.div(b1));
              });
            });
          }
        }
      }
        break;
    }
  });

  return expr;
}

export function foldConstantsRational(expr: Expr): Expr {

  expr.ifCompoundHeadN("/", 2, function([num, den]) {

    const numt = Compound.termsOf("*", num);
    const dent = Compound.termsOf("*", den);

    let numacc = Numeral.one();
    let newnum = numt.filter(function(t) {
      let keep = true;
      t.ifNumber(function(n) {
        numacc = numacc.mul(n);
        keep = false;
      });
      return keep;
    });
    let denacc = Numeral.one();
    let newden = dent.filter(function(t) {
      let keep = true;
      t.ifNumber(function(n) {
        denacc = denacc.mul(n);
        keep = false;
      });
      return keep;
    });

    const total = numacc.div(denacc);
    if (total.eq(Numeral.zero())) {
      // Anything times zero is zero
      expr = Expr.from(0);
    } else if (total.eq(Numeral.one())) {
      // If the resulting constant is one, omit it
      expr = new Expr("/", [Compound.mul(newnum), Compound.mul(newden)]);
    } else {
      let handled = false;
      total.ifRatio(function(r) {
        if (r.num == BigInt(1)) {
          // If it has a numerator of one, it makes sense to move the
          // whole thing to the denominator.
          expr = new Expr("/", [Compound.mul(newnum),
                                Compound.mul(newden, Expr.from(total.recip()))]);
          handled = true;
        }
      });
      if (!handled)
        expr = new Expr("/", [Compound.mul(newnum, Expr.from(total)),
                              Compound.mul(newden)]);
    }

  });

  return expr;
}

export function foldConstantsPow(expr: Expr, mode: Mode): Expr {

  expr.ifCompoundHeadN("^", 2, function([a, b]) {
    if (a.eq(Expr.from(1))) {
      // 1^b ==> 1
      expr = Expr.from(1);
    } else if ((b.eq(Expr.from(0))) &&
               ([Shape.Scalar, Shape.Variable].includes(Shape.of(a, mode)))) {
      // a^0 ==> 1 (if a is scalar or variable shaped)
      // TODO Make this return a generic matrix form if the arg is not scalar
      expr = Expr.from(1);
    } else if (b.eq(Expr.from(1))) {
      // a^1 ==> 1
      expr = a;
    } else {
      // a^b (if both are numbers)
      a.ifNumber(function(a1) {
        b.ifNumber(function(b1) {
          const result = a1.pow(b1);
          // Special exception if we're in symbolic mode
          if (a1.isRational() && b1.isRational() &&
              !result.isRational() && mode.exactness >= ExactnessMode.Symbolic)
            return;
          expr = Expr.from(result);
        });
      });
    }
  });

  return expr;
}

export function evalFunctions(expr: Expr, mode: Mode): Expr {

  expr.ifCompound(function(head, tail) {
    expr = tryApply(StandardLibrary, head, tail, mode);
  });

  return expr;
}

export function evalConstants(expr: Expr, mode: Mode): Expr {

  expr.ifVar(function(v) {
    const props = getConst(v);
    if (props !== undefined) {
      if ((mode.exactness < ExactnessMode.Symbolic) || (props.isExact)) {
        expr = Expr.from(props.value);
      }
    }
  });

  return expr;
}
