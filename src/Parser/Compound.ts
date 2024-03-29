
import Parser, { parseLiteral, parseRegexp } from './Parser'
import { ParseError } from './Error'
import { Operator, Fixity, Assoc } from '../Operator'
import { assert, assertDefined } from '../Assert'

export class CompoundParse<T> {
  private table: Map<string, Operator>;
  private token: (p: Parser) => T | ParseError;
  private fromInfix: (a: T, s: string, b: T) => T;
  private fromPrefix: (s: string, b: T) => T;
  private fromPostfix: (a: T, s: string) => T;

  constructor(args: CompoundParseArgs<T>) {
    this.table = args.table;
    this.token = args.token;
    this.fromInfix = args.fromInfix;
    this.fromPrefix = args.fromPrefix;
    this.fromPostfix = args.fromPostfix;
  }

  parseToken(p: Parser): T | ParseError {
    return this.token(p);
  }

  parseOp(p: Parser, fixity: Fixity): [string, Operator] | ParseError {
    return p.saveExcursion(() => {
      p.skipWhitespace();
      for (const [name, op] of this.table.entries()) {
        if (op.fixity !== fixity)
          continue;
        const result = p.parseLiteral(op.name.trim());
        if (!(result instanceof ParseError)) {
          p.skipWhitespace();
          return [name, op];
        }
      }
      return p.expecting([`${Fixity[fixity]} operator`]);
    });
  }

  parseExpr(p: Parser): T | ParseError {
    return p.saveExcursion(() => {
      const output: T[] = [];
      const op: [string, Operator][] = [];
      let state: "prefix" | "postfix" | "infix" | "token" = "infix";
      const applyOp = () => {
        const curr = assertDefined(op.pop());
        switch (curr[1].fixity) {
          case Fixity.Infix:
            const b1 = assertDefined(output.pop());
            const a1 = assertDefined(output.pop());
            output.push(this.fromInfix(a1, curr[0], b1));
            break;
          case Fixity.Prefix:
            const b = assertDefined(output.pop());
            output.push(this.fromPrefix(curr[0], b));
            break;
          case Fixity.Postfix:
            const a = assertDefined(output.pop());
            output.push(this.fromPostfix(a, curr[0]));
            break;
        }
      };
      const resolveOp = (curr: [string, Operator]) => {
        while ((op.length > 0) && ((op[op.length - 1][1].prec > curr[1].prec) ||
                                   (op[op.length - 1][1].prec == curr[1].prec &&
                                    op[op.length - 1][1].assoc == Assoc.Left))) {
          applyOp();
        }
      };
      loop:
      while (true) {
        p.skipWhitespace();
        switch (state) {
          case "infix":
            // Read Prefix
            const pre = this.parseOp(p, Fixity.Prefix);
            if (!(pre instanceof ParseError)) {
              op.push(pre);
              state = "prefix";
              break;
            }
            // Intentional fallthrough; if we can't read prefix then read token.
          case "prefix":
            // Read Token
            const tok = this.parseToken(p);
            if (tok instanceof ParseError) {
              // Prefix or infix operator not followed by token, so error.
              return tok; // TODO We could marginally improve the error message here
            }
            output.push(tok);
            state = "token";
            break;
          case "token":
            // Read Postfix
            const post = this.parseOp(p, Fixity.Postfix);
            if (!(post instanceof ParseError)) {
              resolveOp(post);
              op.push(post);
              // Apply immediately
              applyOp();
              state = "postfix";
              break;
            }
            // Intentional fallthrough; if we can't read postfix then read infix.
          case "postfix":
            // Read Infix
            const inf = this.parseOp(p, Fixity.Infix);
            if (inf instanceof ParseError) {
              // Postfix operator or token not followed by anything. Not a problem.
              break loop;
            }
            resolveOp(inf);
            state = "infix";
            op.push(inf);
            break;
        }
        p.skipWhitespace();
      }
      while (op.length > 0) {
        applyOp();
      }
      // Hopefully, there's only one value left in the output array
      // now. If not, that's an error in this algorithm.
      assert(output.length == 1);
      return output[0];
    });
  }

}

export interface CompoundParseArgs<T> {
  table: Map<string, Operator>;
  token: (p: Parser) => T | ParseError;
  fromInfix: (a: T, s: string, b: T) => T;
  fromPrefix: (s: string, b: T) => T;
  fromPostfix: (a: T, s: string) => T;
}
