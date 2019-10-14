
import Expr from './Expr'

export interface Printer {

  show(expr: Expr): string;

}

export function show(printer: Printer, expr: Expr): string {
  return printer.show(expr);
}

export function print(printer: Printer, expr: Expr): void {
  console.log(printer.show(expr));
}
