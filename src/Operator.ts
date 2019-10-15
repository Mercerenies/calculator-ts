
export interface Operator {
  readonly name: string;
  readonly fixity: Fixity;
  readonly assoc: Assoc; // Only relevant if fixity == Fixity.Infix
  readonly prec: number;
}

export enum Fixity {
  Infix, Postfix, Prefix
}

export enum Assoc {
  None, Left, Right
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
      assoc: Assoc.None,
      prec: 50,
    }],
    ["fact", {
      name: "!",
      fixity: Fixity.Postfix,
      assoc: Assoc.None,
      prec: 100,
    }],
    ["dfact", {
      name: "!!",
      fixity: Fixity.Postfix,
      assoc: Assoc.None,
      prec: 100,
    }],
  ]);
