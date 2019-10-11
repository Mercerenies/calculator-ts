
export default interface NumberLike<T> {

  add(that: T): T;
  negate(): T;
  sub(that: T): T;
  mul(that: T): T;
  recip(): T;
  div(that: T): T;

}
