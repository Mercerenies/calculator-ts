
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

export function operator(name: string, fixity: Fixity, assoc: Assoc, prec: number): Operator {
  return {
    name: name,
    fixity: fixity,
    assoc: assoc,
    prec: prec,
  };
}
