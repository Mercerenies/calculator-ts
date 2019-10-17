
export class ParseError {
  readonly pos: number;
  readonly message: string;

  constructor(pos: number, message: string) {
    this.pos = pos;
    this.message = message;
  }

}

export function fail(pos: number, message: string): ParseError {
  return new ParseError(pos, message);
}

//export function expecting(pos: number, values: string[]): ParseError {
  //return fail("Expecting "
//}
