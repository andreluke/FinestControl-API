import { StatusCodes } from '#/enums/status-code'
import { CustomError } from './CustomError'

export class TagError extends CustomError {
  constructor(
    message: string,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    code = 'ERROR_TAGS'
  ) {
    super(message, statusCode, code)
  }
}

export class MissingTagParamsError extends TagError {
  constructor() {
    super(
      'Ao menos um dos parâmetros precisa ser informado',
      StatusCodes.BAD_REQUEST,
      'MISSING_TAGS_PARAMS'
    )
  }
}
export class TagNotFoundError extends TagError {
  constructor() {
    super('Tag não encontrada', StatusCodes.NOT_FOUND, 'TAGS_NOT_FOUND')
  }
}
export class TagAlreadyExistsError extends TagError {
  constructor() {
    super('Tag já existe', StatusCodes.CONFLICT, 'TAG_ALREADY_EXISTS')
  }
}

export class TagInvalidColor extends TagError {
  constructor(color: string) {
    super(
      `Cor inválida fornecida: ${color}`,
      StatusCodes.BAD_REQUEST,
      'INVALID_TAG_COLOR'
    )
  }
}
