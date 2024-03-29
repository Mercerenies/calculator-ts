
import Ratio from './Numerical/Ratio'
import Floating from './Numerical/Floating'
import Complex from './Numerical/Complex'
import Numeral from './Numerical/Numeral'
import { noop, never, cmp } from './Util'

export default class Expr {

  private nature: Nature;
  private value: Numeral;
  private head: string;
  private args: Expr[];

  constructor(value: Numeral | string);
  constructor(head: string, args: Expr[]);
  constructor(a: any, b?: any) {
    if (a instanceof Numeral) {
      this.nature = Nature.Number;
      this.value = a;
      this.head = "";
      this.args = [];
    } else if (b !== undefined) {
      this.nature = Nature.Compound;
      this.value = Numeral.zero();
      this.head = a;
      this.args = b;
    } else {
      this.nature = Nature.Variable;
      this.value = Numeral.zero();
      this.head = a;
      this.args = [];
    }
  }

  dispatch<T>(n: (a: Numeral) => T, v: (a: string) => T, c: (a: string, b: Expr[]) => T): T {
    switch (this.nature) {
      case Nature.Number:
        return n(this.value);
      case Nature.Variable:
        return v(this.head);
      case Nature.Compound:
        return c(this.head, this.args);
    }
  }

  isNumber(): boolean {
    return this.nature == Nature.Number;
  }

  isVar(): boolean {
    return this.nature == Nature.Variable;
  }

  isCompound(): boolean {
    return this.nature == Nature.Compound;
  }

  ifNumber(f: (a: Numeral) => void, g: () => void = noop): Expr {
    this.dispatch(f, g, g);
    return this;
  }

  ifVar(f: (a: string) => void, g: () => void = noop): Expr {
    this.dispatch(g, f, g);
    return this;
  }

  ifCompound(f: (a: string, b: Expr[]) => void, g: () => void = noop): Expr {
    this.dispatch(g, g, f);
    return this;
  }

  ifCompoundN(n: number, f: (a: string, b: Expr[]) => void, g: () => void = noop): Expr {
    let handled = false;
    this.ifCompound(function(head, tail) {
      if (tail.length == n) {
        handled = true;
        f(head, tail);
      }
    });
    if (!handled)
      g();
    return this;
  }

  ifCompoundHead(s: string, f: (b: Expr[]) => void, g: () => void = noop): Expr {
    let handled = false;
    this.ifCompound(function(head, tail) {
      if (head == s) {
        handled = true;
        f(tail);
      }
    });
    if (!handled)
      g();
    return this;
  }

  ifCompoundHeadN(s: string, n: number,
                  f: (b: Expr[]) => void, g: () => void = noop): Expr {
    let handled = false;
    this.ifCompound(function(head, tail) {
      if ((head == s) && (tail.length == n)) {
        handled = true;
        f(tail);
      }
    });
    if (!handled)
      g();
    return this;
  }

  hasHead(s: string): boolean {
    return (this.nature == Nature.Compound) && (this.head == s);
  }

  eq(that: Expr): boolean {
    if (this.nature != that.nature)
      return false;
    switch (this.nature) {
      case Nature.Number:
        return this.value.eq(that.value);
      case Nature.Variable:
        return this.head == that.head;
      case Nature.Compound:
        return (
          (this.head == that.head) &&
          (this.args.length == that.args.length) &&
          (this.args.every((a, idx) => a.eq(that.args[idx])))
        );
    }
  }

  lexCmp(that: Expr): "lt" | "gt" | "eq" {
    if (this.nature < that.nature) {
      return "lt";
    } else if (this.nature > that.nature) {
      return "gt";
    } else {
      switch (this.nature) {
        case Nature.Number:
          return this.value.lexCmp(that.value);
        case Nature.Variable:
          return cmp(this.head, that.head);
        case Nature.Compound:
          if (this.head < that.head) {
            return "lt";
          } else if (this.head > that.head) {
            return "gt";
          } else {
            for (let i = 0; i < Math.min(this.args.length, that.args.length); i++) {
              const cmp = this.args[i].lexCmp(that.args[i]);
              if (cmp != "eq")
                return cmp;
            }
            return cmp(this.args.length, that.args.length);
          }
        default:
          return never(this.nature);
      }
    }
  }

  static from(n : bigint | number | string | Ratio | Floating | Complex | Numeral): Expr {
    if ((n instanceof Numeral) || (typeof n == 'string')) {
      return new Expr(n);
    }
    if ((n instanceof Ratio) || (n instanceof Floating) || (n instanceof Complex)) {
      return new Expr(new Numeral(n));
    }
    if (typeof(n) == 'bigint') {
      return new Expr(new Numeral(Ratio.fromInt(n)));
    }
    if (typeof(n) == 'number') {
      if (Number.isInteger(n))
        return new Expr(new Numeral(Ratio.fromInt(BigInt(n))));
      else
        return new Expr(new Numeral(new Floating(n)));
    }
    return never(n);
  }

}

enum Nature {
  Number = 0, Variable = 1, Compound = 2,
}
