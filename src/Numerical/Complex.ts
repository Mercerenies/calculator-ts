
import NumberLike from './NumberLike'
import Floating from './Floating'

export default class Complex implements NumberLike<Complex> {

  readonly real: number;
  readonly imag: number;

  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  add(that: Complex): Complex {
    return new Complex(this.real + that.real, this.imag + that.imag);
  }

  negate(): Complex {
    return new Complex(- this.real, - this.imag);
  }

  sub(that: Complex): Complex {
    return this.add(that.negate());
  }

  mul(that: Complex): Complex {
    return new Complex(this.real * that.real - this.imag * that.imag,
                       this.real * that.imag + this.imag * that.real);
  }

  conj(): Complex {
    return new Complex(this.real, - this.imag);
  }

  div(that: Complex): Complex {
    let num = this.mul(that.conj());
    let den = that.real * that.real + that.imag * that.imag;
    return new Complex(num.real / den, num.imag / den);
  }

  recip(): Complex {
    return new Complex(1, 0).div(this);
  }

  abs(): Floating {
    return new Floating(Math.sqrt(this.real * this.real + this.imag * this.imag));
  }

  exp(): Complex {
    const c = Math.exp(this.real);
    const re = Math.cos(this.imag);
    const im = Math.sin(this.imag);
    return new Complex(re * c, im * c);
  }

  ln(): Complex {
    const re = Math.log(this.abs().value);
    const im = Math.atan2(this.imag, this.real);
    return new Complex(re, im);
  }

  pow(that: Complex): Complex {
    return (that.mul(this.ln())).exp();
  }

  eq(that: Complex): boolean {
    return (
      (new Floating(this.real).eq(new Floating(that.real))) &&
      (new Floating(this.imag).eq(new Floating(that.imag)))
    );
  }

  toString(): string {
    return "(" + this.real.toString() + "," + this.imag.toString() + ")";
  }

  static zero(): Complex {
    return new Complex(0, 0);
  }

}

export function complex(real: number, imag: number): Complex {
  return new Complex(real, imag);
}
