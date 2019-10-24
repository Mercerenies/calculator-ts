
import Ratio from './Ratio'
import Floating from './Floating'
import Complex from './Complex'
import NumberLike from './NumberLike'
import { cmp, never, noop } from '../Util'

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

  ifRatio(f: (a: Ratio) => void, g: () => void = noop): Numeral {
    this.dispatch(f, g, g);
    return this;
  }

  ifFloating(f: (a: Floating) => void, g: () => void = noop): Numeral {
    this.dispatch(g, f, g);
    return this;
  }

  ifComplex(f: (a: Complex) => void, g: () => void = noop): Numeral {
    this.dispatch(g, g, f);
    return this;
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
    // Special case for rational division by zero
    if (this.level === Level.Rational && this.r.eq(Ratio.zero()))
      return new Numeral(new Floating(0)).recip();
    return unaryDispatchU(this, (a) => numeral(a.recip()));
  }

  div(that: Numeral): Numeral {
    return this.mul(that.recip());
  }

  exp(): Numeral {
    return unaryDispatchFloat(this,
                              (a) => numeral(a.exp()),
                              (a) => numeral(a.exp()));
  }

  ln(): Numeral {
    return unaryDispatchFloat(this,
                              (a) => numeral(a.ln()),
                              (a) => numeral(a.ln()));
  }

  pow(that: Numeral): Numeral {
    return pow(this, that);
  }

  eq(that: Numeral) {
    return binaryPromoteU(this, that, (a, b) => a.eq(b));
  }

  lexCmp(that: Numeral): "eq" | "gt" | "lt" {
    // This ordering is not "natural" in any way. It's arbitrary but
    // consistent. It also doesn't agree with the above notion of
    // equality (which promotes, whereas this does not).
    if (this.level < that.level) {
      return "lt";
    } else if (this.level > that.level) {
      return "gt";
    } else {
      switch (this.level) {
        case Level.Rational:
          if (this.r.num < that.r.num)
            return "lt";
          else if (this.r.num > that.r.num)
            return "gt";
          else
            return cmp(this.r.den, that.r.den);
        case Level.Floating:
          return cmp(this.f.value, that.f.value);
        case Level.Complex:
          if (this.c.real < that.c.real)
            return "lt";
          else if (this.c.real > that.c.real)
            return "gt";
          else
            return cmp(this.c.imag, that.c.imag);
        default:
          return never(this.level);
      }
    }
  }

  toString(): string {
    return unaryDispatchU(this, (a) => a.toString());
  }

  isRational(): boolean {
    return this.level === Level.Rational;
  }

  isFloating(): boolean {
    return this.level === Level.Floating;
  }

  isComplex(): boolean {
    return this.level === Level.Complex;
  }

  isPositive(): boolean {
    return this.dispatch(
      (r) => r.gt(Ratio.zero()),
      (f) => f.gt(Floating.zero()),
      (c) => false
    );
  }

  isNegative(): boolean {
    return this.dispatch(
      (r) => r.lt(Ratio.zero()),
      (f) => f.lt(Floating.zero()),
      (c) => false
    );
  }

  static zero(): Numeral {
    return numeral(Ratio.zero());
  }

  static one(): Numeral {
    return numeral(Ratio.one());
  }

  static pi(): Numeral {
    return numeral(Floating.pi());
  }

  static fromInt(a: bigint | number): Numeral {
    return numeral(Ratio.fromInt(a));
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

export function unaryDispatchFloat<T>(num: Numeral,
                                      f: (a: Floating) => T,
                                      c: (a: Complex) => T): T {
  return unaryDispatch(num, (a) => f(rToF(a)), f, c);
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

function npow(x: Numeral, b: bigint): Numeral {
  if (b == BigInt(0)) {
    return Numeral.one();
  } else if (b < BigInt(0)) {
    return npow(x.recip(), - b);
  } else {
    if (b % BigInt(2) == BigInt(0)) {
      const y = npow(x, b / BigInt(2));
      return y.mul(y);
    } else {
      const y = npow(x, b / BigInt(2));
      return y.mul(y).mul(x);
    }
  }
}

function pow(x: Numeral, y: Numeral): Numeral {

  // First, deal with the "base" cases of zero.
  if (y.eq(Numeral.zero()))
    return Numeral.one();
  if (x.eq(Numeral.zero()))
    return Numeral.zero();

  return x.dispatch(
    (a) => {
      return y.dispatch(
        (b) => {
          // Ratio / Ratio
          if (b.den == BigInt(1)) {
            return npow(x, b.num);
          } else if (a.gt(Ratio.zero())) {
            return numeral(rToF(a).pow(rToF(b)));
          } else {
            return numeral(rToC(a).pow(rToC(b)));
          }
        },
        (b) => {
          // Ratio / Float
          if (a.gt(Ratio.zero())) {
            return numeral(rToF(a).pow(b));
          } else {
            return numeral(rToC(a).pow(fToC(b)));
          }
        },
        (b) => {
          // Ratio / Complex
          return numeral(rToC(a).pow(b));
        },
      );
    },
    (a) => {
      return y.dispatch(
        (b) => {
          // Float / Ratio
          if (b.den == BigInt(1)) {
            return npow(x, b.num);
          } else if (a.gt(Floating.zero())) {
            return numeral(a.pow(rToF(b)));
          } else {
            return numeral(fToC(a).pow(rToC(b)));
          }
        },
        (b) => {
          // Float / Float
          if (a.gt(Floating.zero())) {
            return numeral(a.pow(b));
          } else {
            return numeral(fToC(a).pow(fToC(b)));
          }
        },
        (b) => {
          // Float / Complex
          return numeral(fToC(a).pow(b));
        },
      );
    },
    (a) => {
      return y.dispatch(
        (b) => {
          // Complex / Ratio
          return numeral(a.pow(rToC(b)));
        },
        (b) => {
          // Complex / Float
          return numeral(a.pow(fToC(b)));
        },
        (b) => {
          // Complex / Complex
          return numeral(a.pow(b));
        },
      );
    },
  );
}
