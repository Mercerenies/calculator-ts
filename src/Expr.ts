
import Ratio from './Numerical/Ratio'
import Floating from './Numerical/Floating'
import Complex from './Numerical/Complex'
import Numeral from './Numerical/Numeral'
import { noop, never } from './Util'

export default class Expr {

  private nature: "number" | "variable" | "compound";
  private value: Numeral
  private head: string;
  private args: Expr[];

  constructor(value: Numeral | string);
  constructor(head: string, args: Expr[]);
  constructor(a: any, b?: any) {
    if (a instanceof Numeral) {
      this.nature = "number";
      this.value = a;
      this.head = "";
      this.args = [];
    } else if (b !== undefined) {
      this.nature = "compound";
      this.value = Numeral.zero();
      this.head = a;
      this.args = b;
    } else {
      this.nature = "variable";
      this.value = Numeral.zero();
      this.head = a;
      this.args = [];
    }
  }

  dispatch<T>(n: (a: Numeral) => T, v: (a: string) => T, c: (a: string, b: Expr[]) => T): T {
    switch (this.nature) {
      case "number":
        return n(this.value);
      case "variable":
        return v(this.head);
      case "compound":
        return c(this.head, this.args);
    }
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
    return (this.nature == "compound") && (this.head == s);
  }

  eq(that: Expr): boolean {
    if (this.nature != that.nature)
      return false;
    switch (this.nature) {
      case "number":
        return this.value == that.value;
      case "variable":
        return this.head == that.head;
      case "compound":
        return (
          (this.head == that.head) &&
          (this.args.length == that.args.length) &&
          (this.args.every((a, idx) => a.eq(that.args[idx])))
        );
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
