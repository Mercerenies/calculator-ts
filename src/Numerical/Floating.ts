
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

  toString(): string {
    return this.value.toString();
  }

  static zero(): Floating {
    return new Floating(0);
  }

}

export function floating(a: number): Floating {
  return new Floating(a);
}
