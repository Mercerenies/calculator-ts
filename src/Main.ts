
import Expr from './Expr'
import { print, show } from './Printer'
import LispLikePrinter from './Printer/LispLikePrinter'
import PrettyPrinter from './Printer/PrettyPrinter'
import Numeral from './Numerical/Numeral'
import Ratio from './Numerical/Ratio'
import Parser from './Parser/Parser'
import { parseFullExpr } from './Parser/Expr'

import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const llp = new LispLikePrinter();
const pp = new PrettyPrinter();

rl.on('line', (line) => {
  const parser = new Parser(line);
  const expr = parseFullExpr(parser);
  if (expr === null) {
    console.log("ERROR: Could not parse");
    console.log("Stopped at " + parser.pos);
  } else {
    print(llp, expr);
    print(pp, expr);
  }
});

/*
let a = rl.prompt();
console.log(a);

console.log("HELLO");

let example1 =
  new Expr("+", [new Expr(new Numeral(Ratio.fromInt(BigInt(3)))), new Expr("x"), new Expr("*", [new Expr("y"), new Expr("z")])])
let example2 =
  new Expr("*", [new Expr(new Numeral(Ratio.fromInt(BigInt(3)))), new Expr("x"), new Expr("+", [new Expr("y"), new Expr("z")])])

print(new LispLikePrinter(), example1);
print(new PrettyPrinter(), example1);
print(new LispLikePrinter(), example2);
print(new PrettyPrinter(), example2);
*/
