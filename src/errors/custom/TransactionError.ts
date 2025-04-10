import { StatusCodes } from '#/enums/status-code'
import { CustomError } from './CustomError'

export class TransactionError extends CustomError {
  constructor(
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    code = 'ERROR_TRANSACTION'
  ) {
    super(message, statusCode, code)
  }
}

export class MissingTransactionParamsError extends TransactionError {
  constructor() {
    super(
      'Ao menos um dos parâmetros precisa ser informado',
      StatusCodes.BAD_REQUEST,
      'MISSING_TRANSACTION_PARAMS'
    )
  }
}
export class TransactionNotFoundError extends TransactionError {
  constructor() {
    super(
      'Transação não encontrada',
      StatusCodes.NOT_FOUND,
      'TRANSACTION_NOT_FOUND'
    )
  }
}
