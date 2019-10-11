
import Ratio from './Ratio'
import Floating from './Floating'
import Complex from './Complex'
import NumberLike from './NumberLike'

export default class Numeral implements NumberLike<Numeral> {

  readonly level: Level;
  private r: Ratio;
  private f: Floating;
  private c: Complex;

  constructor(value: Ratio | Floating | Complex) {
    if (value instanceof Ratio) {
      this.level = Level.Rational;
      this.r = value;
      this.f = Floating.zero();
      this.c = Complex.zero();
    } else if (value instanceof Complex) {
      this.level = Level.Complex;
      this.r = Ratio.zero();
      this.f = Floating.zero();
      this.c = value;
    } else {
      this.level = Level.Floating;
      this.r = Ratio.zero();
      this.f = value;
      this.c = Complex.zero();
    }
  }

  dispatch<T>(r: (a: Ratio) => T, f: (a: Floating) => T, c: (a: Complex) => T): T {
    switch (this.level) {
      case Level.Rational:
        return r(this.r);
      case Level.Floating:
        return f(this.f);
      case Level.Complex:
        return c(this.c);
    }
  }

  add(that: Numeral): Numeral {
    return binaryPromoteU(this, that, (a, b) => numeral(a.add(b)));
  }

  negate(): Numeral {
    return unaryDispatchU(this, (a) => numeral(a.negate()));
  }

  sub(that: Numeral): Numeral {
    return this.add(that.negate());
  }

  mul(that: Numeral): Numeral {
    return binaryPromoteU(this, that, (a, b) => numeral(a.mul(b)));
  }

  recip(): Numeral {
    return unaryDispatchU(this, (a) => numeral(a.recip()));
  }

  div(that: Numeral): Numeral {
    return this.mul(that.recip());
  }

  static zero(): Numeral {
    return numeral(Ratio.zero());
  }

}

export enum Level {
  Rational = 0, Floating = 1, Complex = 2
}

export function numeral<U extends NumberLike<U>>(value: U): Numeral {
  if (value instanceof Ratio || value instanceof Complex || value instanceof Floating)
    return new Numeral(value);
  else if (value instanceof Numeral)
    return value;
  else
    throw "unknown number type to numeral(...)";
}

function rToF(a: Ratio): Floating {
  return new Floating(a.toFloating());
}

function fToC(a: Floating): Complex {
  return new Complex(a.value, 0);
}

function rToC(a: Ratio): Complex {
  return fToC(rToF(a));
}

export function unaryDispatch<T>(num: Numeral,
                                 r: (a: Ratio) => T,
                                 f: (a: Floating) => T,
                                 c: (a: Complex) => T): T {
  return num.dispatch(r, f, c);
}

export function unaryDispatchU<T>(num: Numeral, g: <U extends NumberLike<U>>(a: U) => T): T {
  return unaryDispatch(num, g, g, g);
}

export function binaryPromote<T>(a: Numeral,
                                 b: Numeral,
                                 r: (a: Ratio, b: Ratio) => T,
                                 f: (a: Floating, b: Floating) => T,
                                 c: (a: Complex, b: Complex) => T): T {
  return a.dispatch((a) => {
    return b.dispatch((b) => {
      return r(a, b);
    }, (b) => {
      return f(rToF(a), b);
    }, (b) => {
      return c(rToC(a), b);
    });
  }, (a) => {
    return b.dispatch((b) => {
      return f(a, rToF(b));
    }, (b) => {
      return f(a, b);
    }, (b) => {
      return c(fToC(a), b);
    });
  }, (a) => {
    return b.dispatch((b) => {
      return c(a, rToC(b));
    }, (b) => {
      return c(a, fToC(b));
    }, (b) => {
      return c(a, b);
    });
  });
}

export function binaryPromoteU<T>(a: Numeral, b: Numeral,
                                  g: <U extends NumberLike<U>>(a: U, b: U) => T): T {
  return binaryPromote(a, b, g, g, g);
}
