
import Parser, { parseLiteral, parseRegexp } from './Parser'
import { Operator, Fixity, Assoc } from '../Operator'

export class CompoundParse {
  private table: Map<string, Operator>;

  constructor(table: Map<string, Operator>) {
    // TODO Array.from... really? Can we get away without constructing
    // this array?
    this.table = new Map(Array.from(table.entries())
                         .map(([s, op]) => [op.name, Object.assign({}, { name: s }, op)]));
  }

}
