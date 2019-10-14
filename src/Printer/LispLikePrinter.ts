
import { Printer } from '../Printer'
import Expr from '../Expr'

export default class LispLikePrinter implements Printer {

  show(expr: Expr): string {
    return expr.dispatch(
      (n) => n.toString(),
      (v) => v,
      (head, tail) => "(" + head + tail.map((t) => " " + this.show(t)).join('') + ")"
    );
  }

}
