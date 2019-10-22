
import Expr from './Expr'
import { print, show } from './Printer/Printer'
import LispLikePrinter from './Printer/LispLikePrinter'
import PrettyPrinter from './Printer/PrettyPrinter'
import Numeral from './Numerical/Numeral'
import Ratio from './Numerical/Ratio'
import Parser from './Parser/Parser'
import { parseExprFromLine } from './Parser/Expr'
import { ParseError } from './Parser/Error'
import { Pass, compose, runPassTD } from './Pass/Pass'
import * as Normalize from './Pass/Normalize'
import * as Factoring from './Pass/Factoring'
import * as Fold from './Pass/Fold'
import { Mode, DefaultMode } from './Mode'

import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const llp = new LispLikePrinter();
const pp = new PrettyPrinter();
const mode = DefaultMode;

const SAFETY = 1000;

const samplePass = compose([
  Normalize.normalizeNegatives, Normalize.levelStdOperators,
  Normalize.simplifyRationals, Factoring.collectLikeFactors,
  Factoring.collectLikeTerms, Normalize.flattenNestedExponents,
  Fold.foldConstants, Fold.foldConstantsPow, Fold.evalConstants,
  Normalize.flattenStdSingletons, Normalize.flattenStdNullaryOps,
  Normalize.sortTermsAdditive, Normalize.sortTermsMultiplicative,
  Normalize.promoteRatios
]);

rl.on('line', (line) => {
  const expr = parseExprFromLine(line);
  if (expr instanceof ParseError) {
    console.log(expr.toString());
  } else {
    print(llp, expr);
    print(pp, expr);
    const expr1 = runPassTD(samplePass, expr, mode, SAFETY);
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
