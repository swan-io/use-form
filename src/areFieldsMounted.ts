import { AnyRecord, Simplify } from "./types";

export const NONE = Symbol.for("none");
export type None = typeof NONE;

export const isFieldMounted = <T>(value: T): value is Exclude<T, None> =>
  value !== NONE;

export const areFieldsMounted = <
  T extends AnyRecord,
  K extends keyof T = keyof T,
>(
  values: T,
  keys: K[],
): values is Simplify<T & { [K1 in K]: Exclude<T[K1], None> }> =>
  keys.every((key) => values[key] !== NONE);
