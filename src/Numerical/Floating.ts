
import NumberLike from './NumberLike'

// This is a simple wrapper around the built-in number type to give it
// a common interface with Floating and Complex.
export default class Floating implements NumberLike<Floating> {

  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  add(that: Floating): Floating {
    return new Floating(this.value + that.value);
  }

  negate(): Floating {
    return new Floating(- this.value);
  }

  sub(that: Floating): Floating {
    return this.add(that.negate());
  }

  mul(that: Floating): Floating {
    return new Floating(this.value * that.value);
  }

  recip(): Floating {
    return new Floating(1 / this.value);
  }

  div(that: Floating): Floating {
    return this.mul(that.recip());
  }

  exp(): Floating {
    return new Floating(Math.exp(this.value));
  }

  ln(): Floating {
    return new Floating(Math.log(this.value));
  }

  pow(that: Floating): Floating {
    return (that.mul(this.ln())).exp();
  }

  eq(that: Floating): boolean {
    return (isNaN(this.value) && isNaN(that.value)) || (this.value == that.value);
  }

  lt(that: Floating): boolean {
    return this.value < that.value;
  }

  gt(that: Floating): boolean {
    return this.value > that.value;
  }

  toString(): string {
    return this.value.toString();
  }

  static zero(): Floating {
    return new Floating(0);
  }

  static pi(): Floating {
    return new Floating(Math.PI);
  }

}

export function floating(a: number): Floating {
  return new Floating(a);
}
