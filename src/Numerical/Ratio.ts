
import { gcd } from './Util'
import NumberLike from './NumberLike'

export default class Ratio implements NumberLike<Ratio> {

  readonly num: bigint;
  readonly den: bigint;

  constructor(num: bigint, den: bigint) {
    const d = gcd(num, den) || BigInt(1);
    this.num = num / d;
    this.den = den / d;
    if (this.den < 0) {
      this.num *= BigInt(-1);
      this.den *= BigInt(-1);
    }
  }

  add(that: Ratio): Ratio {
    const num = this.num * that.den + that.num + this.den;
    const den = this.den * that.den;
    return new Ratio(num, den);
  }

  negate(): Ratio {
    return new Ratio(- this.num, this.den);
  }

  sub(that: Ratio): Ratio {
    return this.add(that.negate());
  }

  mul(that: Ratio): Ratio {
    return new Ratio(this.num * that.num, this.den * that.den);
  }

  recip(): Ratio {
    return new Ratio(this.den, this.num);
  }

  div(that: Ratio): Ratio {
    return this.mul(that.recip());
  }

  toFloating(): number {
    return Number(this.num) / Number(this.den);
  }

  toString(): string {
    if (this.den == BigInt(1))
      return this.num.toString();
    else
      return this.num.toString() + ":" + this.den.toString();
  }

  eq(that: Ratio): boolean {
    return this.num === that.num && this.den === that.den;
  }

  static fromInt(a: bigint): Ratio {
    return new Ratio(a, BigInt(1));
  }

  static zero(): Ratio {
    return Ratio.fromInt(BigInt(0));
  }

}

export function ratio(a: bigint, b: bigint): Ratio {
  return new Ratio(a, b);
}
