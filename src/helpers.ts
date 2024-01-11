export const asyncNoop = () => Promise.resolve();
export const syncNoop = () => {};
export const identity = <T>(value: T) => value;
export const isEmptyString = (value: unknown) => value === "";

export const isPromise = <T>(value: unknown): value is Promise<T> =>
  !!value &&
  (typeof value === "object" || typeof value === "function") &&
  typeof (value as { then?: () => void }).then === "function";
