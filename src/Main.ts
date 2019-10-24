
import Expr from './Expr'
import { print, show } from './Printer/Printer'
import LispLikePrinter from './Printer/LispLikePrinter'
import PrettyPrinter from './Printer/PrettyPrinter'
import Numeral from './Numerical/Numeral'
import Ratio from './Numerical/Ratio'
import Parser from './Parser/Parser'
import { parseExprFromLine } from './Parser/Expr'
import { ParseError } from './Parser/Error'
import { Pass, runPassTD } from './Pass/Pass'
import { FullPass } from './Pass/Compiled'
import { Mode, DefaultMode } from './Mode'
import { showHelp, parseArgs } from './CommandLine'
import { never } from './Util'

import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const llp = new LispLikePrinter();
const pp = new PrettyPrinter();

const mode0 = parseArgs(process.argv.slice(2));

if (mode0 === "help") {
  showHelp();
  process.exit(1);
}
const mode = mode0 as Mode;

const SAFETY = 1000;

rl.on('line', (line) => {
  const expr = parseExprFromLine(line);
  if (expr instanceof ParseError) {
    console.log(expr.toString());
  } else {
    print(llp, expr);
    print(pp, expr);
    const expr1 = runPassTD(FullPass, expr, mode, SAFETY);
    print(llp, expr1);
    print(pp, expr1);
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
