export const resolveAfter = <T>(delay: number, value?: T): Promise<T | void> =>
  new Promise((resolve) => setTimeout(() => resolve(value), delay));

export const rejectAfter = <T>(delay: number, value?: T): Promise<T | void> =>
  new Promise((_, reject) => setTimeout(() => reject(value), delay));
