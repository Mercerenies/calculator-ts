
export interface Operator {
  readonly name: string;
  readonly fixity: Fixity;
  readonly assoc: Assoc; // If fixity is not Infix, ensure associativity is left
  readonly prec: number;
}

export enum Fixity {
  Infix, Postfix, Prefix
}

export enum Assoc {
  Left, Right
}

export const StdOperatorTable: Map<string, Operator> =
  new Map<string, Operator>([
    ["+", {
      name: " + ",
      fixity: Fixity.Infix,
      assoc: Assoc.Left,
      prec: 50,
    }],
    ["-", {
      name: " - ",
      fixity: Fixity.Infix,
      assoc: Assoc.Left,
      prec: 50,
    }],
    ["*", {
      name: " * ",
      fixity: Fixity.Infix,
      assoc: Assoc.Left,
      prec: 60,
    }],
    ["/", {
      name: " / ",
      fixity: Fixity.Infix,
      assoc: Assoc.Left,
      prec: 60,
    }],
    ["^", {
      name: "^",
      fixity: Fixity.Infix,
      assoc: Assoc.Right,
      prec: 70,
    }],
    ["_", {
      name: "-",
      fixity: Fixity.Prefix,
      assoc: Assoc.Left,
      prec: 50,
    }],
    ["dfact", {
      name: "!!",
      fixity: Fixity.Postfix,
      assoc: Assoc.Left,
      prec: 100,
    }],
    ["fact", {
      name: "!",
      fixity: Fixity.Postfix,
      assoc: Assoc.Left,
      prec: 100,
    }],
  ]);
