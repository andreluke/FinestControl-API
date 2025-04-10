import type { TryCatchResult, UnionFromTuple } from '#/@types/utils/catchError'
import { CustomError } from '#/errors/custom/CustomError'

export function catchError<T>(
  promise: Promise<T>
): Promise<TryCatchResult<T, CustomError>>

export function catchError<T, const E extends readonly CustomError[]>(
  promise: Promise<T>,
  ...customErrors: E
): Promise<TryCatchResult<T, UnionFromTuple<E>>>

export async function catchError<
  T,
  const E extends readonly CustomError[] = [],
>(
  promise: Promise<T>,
  ...customErrors: E
): Promise<TryCatchResult<T, UnionFromTuple<E>>> {
  try {
    const result = await promise
    return [null, result]
  } catch (err: unknown) {
    let error: CustomError

    if (err instanceof CustomError) {
      error = err
    } else if (customErrors.length > 0) {
      const matched = customErrors.find(customErr => {
        return (
          err instanceof Object &&
          'code' in err &&
          customErr.code === (err as { code?: string }).code
        )
      })

      const selectedError = matched ?? customErrors[0]
      selectedError.message = String(err instanceof Error ? err.message : err)
      error = selectedError
    } else {
      error = new CustomError(String(err instanceof Error ? err.message : err))
    }

    return [error as UnionFromTuple<E>, null]
  }
}
