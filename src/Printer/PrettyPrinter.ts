
import { Printer } from '../Printer'
import Expr from '../Expr'
import { StdOperatorTable, Fixity, Assoc } from '../Operator'

export default class PrettyPrinter implements Printer {

  private maybeParens(s: string, p: boolean): string {
    if (p)
      return "(" + s + ")";
    else
      return s;
  }

  private showAtCompound(head: string, tail: Expr[], prec: number): string {
    const lookup = StdOperatorTable.get(head);
    if (lookup) {
      let str = "";
      switch (lookup.fixity) {
        case Fixity.Infix:
          if (tail.length > 1) {
            let inner = tail.map((t) => this.showAt(t, lookup.prec + 1)).join(lookup.name);
            return this.maybeParens(inner, lookup.prec < prec);
          }
          break;
        case Fixity.Prefix:
          if (tail.length == 1) {
            let inner = this.showAt(tail[0], lookup.prec + 1);
            return this.maybeParens(lookup.name + inner, lookup.prec < prec);
          }
          break;
        case Fixity.Postfix:
          if (tail.length == 1) {
            let inner = this.showAt(tail[0], lookup.prec + 1);
            return this.maybeParens(inner + lookup.name, lookup.prec < prec);
          }
          break;
      }
    }
    let str = "";
    str += head + "(";
    str += tail.map((t) => this.showAt(t, 0)).join(", ");
    str += ")";
    return str;
  }

  private showAt(expr: Expr, prec: number): string {
    return expr.dispatch(
      (n) => n.toString(),
      (v) => v,
      (head, tail) => this.showAtCompound(head, tail, prec),
    );
  }

  show(expr: Expr): string {
    return this.showAt(expr, 0);
  }

}
