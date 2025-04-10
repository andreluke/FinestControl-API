import { StatusCodes } from '#/enums/status-code'
import { CustomError } from './CustomError'

export class TotalAmountError extends CustomError {
  constructor(
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    code = 'ERROR_TOTAL_AMOUNT'
  ) {
    super(message, statusCode, code)
  }
}

export class MissingTotalAmountParamsError extends TotalAmountError {
  constructor() {
    super(
      'Ao menos um dos parâmetros precisa ser informado',
      StatusCodes.BAD_REQUEST,
      'MISSING_TOTAL_AMOUNT_PARAMS'
    )
  }
}
export class TotalAmountNotFoundError extends TotalAmountError {
  constructor() {
    super(
      'Valor total não encontrado',
      StatusCodes.NOT_FOUND,
      'TOTAL_AMOUNT_NOT_FOUND'
    )
  }
}
