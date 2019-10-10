
export default class Complex {

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
