
import Ratio from './Ratio'
import Complex from './Complex'

export default class Number {

  readonly level: Level;
  private r: Ratio;
  private f: number;
  private c: Complex;

  constructor(value: Ratio | number | Complex) {
    if (value instanceof Ratio) {
      this.level = Level.Rational;
      this.r = value;
      this.f = 0;
      this.c = Complex.zero();
    } else if (value instanceof Complex) {
      this.level = Level.Complex;
      this.r = Ratio.zero();
      this.f = 0;
      this.c = value;
    } else {
      this.level = Level.Floating;
      this.r = Ratio.zero();
      this.f = value;
      this.c = Complex.zero();
    }
  }

}

export enum Level {
  Rational = 0, Floating = 1, Complex = 2
}
