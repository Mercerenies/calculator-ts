
import Numeral from './Numerical/Numeral'
import { noop } from './Util'

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

  ifNumber(f: (a: Numeral) => void): Expr {
    this.dispatch(f, noop, noop);
    return this;
  }

  ifVar(f: (a: string) => void): Expr {
    this.dispatch(noop, f, noop);
    return this;
  }

  ifCompound(f: (a: string, b: Expr[]) => void): Expr {
    this.dispatch(noop, noop, f);
    return this;
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

}
