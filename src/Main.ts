
import Expr from './Expr'
import { print, show } from './Printer'
import LispLikePrinter from './Printer/LispLikePrinter'
import PrettyPrinter from './Printer/PrettyPrinter'
import Numeral from './Numerical/Numeral'
import Ratio from './Numerical/Ratio'

console.log("HELLO");

let example1 =
  new Expr("+", [new Expr(new Numeral(Ratio.fromInt(BigInt(3)))), new Expr("x"), new Expr("*", [new Expr("y"), new Expr("z")])])
let example2 =
  new Expr("*", [new Expr(new Numeral(Ratio.fromInt(BigInt(3)))), new Expr("x"), new Expr("+", [new Expr("y"), new Expr("z")])])

print(new LispLikePrinter(), example1);
print(new PrettyPrinter(), example1);
print(new LispLikePrinter(), example2);
print(new PrettyPrinter(), example2);
