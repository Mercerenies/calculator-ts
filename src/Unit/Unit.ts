
import Dimension from './Dimension'
import Expr from '../Expr'
import * as Compound from '../Compound'

export default class Unit {
  private dimension: Dimension;
  private numerator: string[];
  private denominator: string[];
  private multToBase: Expr;

  private constructor(parms: UnitParams) {
    this.dimension = parms.dimension;
    this.numerator = parms.numerator;
    this.denominator = parms.denominator;
    this.multToBase = parms.multToBase;
  }

  mul(that: Unit): Unit {
    return new Unit({
      dimension: this.dimension.mul(that.dimension),
      numerator: this.numerator.concat(that.numerator),
      denominator: this.denominator.concat(that.denominator),
      multToBase: Compound.binMul(this.multToBase, that.multToBase),
    });
  }

  recip(): Unit {
    return new Unit({
      dimension: this.dimension.recip(),
      numerator: this.denominator,
      denominator: this.numerator,
      multToBase: Compound.unRecip(this.multToBase),
    });
  }

  div(that: Unit): Unit {
    return this.mul(that.recip());
  }

  scal(value: Expr): Unit {
    return new Unit({
      dimension: this.dimension,
      numerator: this.numerator,
      denominator: this.denominator,
      multToBase: Compound.binMul(this.multToBase, value),
    });
  }

  rename(newname: string): Unit {
    return new Unit({
      dimension: this.dimension,
      numerator: [newname],
      denominator: [],
      multToBase: this.multToBase,
    });
  }

  nameAsExpr(): Expr {
    const num = stringsToExpr(this.numerator);
    const den = stringsToExpr(this.denominator);
    return new Expr("/", [num, den]);
  }

  static convert(unit1: Unit, unit2: Unit, value: Expr): Expr | null {
    if (!unit1.dimension.eq(unit2.dimension))
      return null; // If dimensions are not equal, we can't convert.
    return new Expr("/", [new Expr("*", [value, unit1.multToBase]), unit2.multToBase]);
  }

  static simple(name: string, dim: Dimension | Dimension.SimpleDim, tobase: Expr): Unit {
    if (!(dim instanceof Dimension))
      dim = Dimension.simple(dim);
    return new Unit({
      dimension: dim,
      numerator: [name],
      denominator: [],
      multToBase: tobase,
    });
  }

  static base(name: string, dim: Dimension | Dimension.SimpleDim): Unit {
    return this.simple(name, dim, Expr.from(1));
  }

}

function stringsToExpr(arr: string[]): Expr {
  const map: Map<string, number> = new Map();
  for (const s of arr) {
    map.set(s, (map.get(s) || 0) + 1);
  }
  return Compound.mul(Array.from(map.entries()).map(([s, n]) =>
                                                    new Expr("^", [Expr.from(s), Expr.from(n)])));
}

interface UnitParams {
  dimension: Dimension;
  numerator: string[];
  denominator: string[];
  multToBase: Expr;
}
