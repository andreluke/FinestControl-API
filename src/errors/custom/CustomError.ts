import { StatusCodes } from '#/enums/status-code'

export class CustomError extends Error {
  statusCode: number
  code: string

  constructor(
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    code = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
