import { StatusCodes } from '#/enums/status-code'
import { CustomError } from './CustomError'

export class PaymentTypeError extends CustomError {
  constructor(
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    code = 'ERROR_PAYMENT_TYPE'
  ) {
    super(message, statusCode, code)
  }
}

export class PaymentTypeMissingParamsError extends PaymentTypeError {
  constructor() {
    super(
      'Ao menos um dos parâmetros precisa ser informado',
      StatusCodes.BAD_REQUEST,
      'MISSING_PAYMENT_TYPE_PARAMS'
    )
  }
}

export class PaymentTypeNotFoundError extends PaymentTypeError {
  constructor() {
    super(
      'Tipo de pagamento não encontrado',
      StatusCodes.NOT_FOUND,
      'PAYMENT_TYPE_NOT_FOUND'
    )
  }
}
export class PaymentTypeAlreadyExistsError extends PaymentTypeError {
  constructor() {
    super(
      'Tipo de pagamento já existe',
      StatusCodes.CONFLICT,
      'PAYMENT_TYPE_ALREADY_EXISTS'
    )
  }
}
