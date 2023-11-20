import { AnyRecord, Simplify } from "./types";

export const UNSET = Symbol.for("unset");
export type Unset = typeof UNSET;

export const isValueSet = <T>(value: T): value is Exclude<T, Unset> => value !== UNSET;

export const areValuesSet = <T extends AnyRecord, K extends keyof T = keyof T>(
  values: T,
  keys: K[],
): values is Simplify<T & { [K1 in K]: Exclude<T[K1], Unset> }> =>
  keys.every((key) => values[key] !== UNSET);
