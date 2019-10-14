
import Expr from './Expr'
import { print, show } from './Printer'
import LispLikePrinter from './Printer/LispLikePrinter'
import Numeral from './Numerical/Numeral'
import Ratio from './Numerical/Ratio'

console.log("HELLO");

let example =
  new Expr("+", [new Expr(new Numeral(Ratio.fromInt(BigInt(3)))), new Expr("x"), new Expr("*", [new Expr("y"), new Expr("z")])])

print(new LispLikePrinter(), example);
