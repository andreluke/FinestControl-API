import type { CustomError } from '#/errors/custom/CustomError'

export type UnionFromTuple<T extends readonly CustomError[]> = T extends []
  ? CustomError
  : T[number]

export type TryCatchResult<T, E extends CustomError> =
  | [error: E, result: null]
  | [error: null, result: T]
