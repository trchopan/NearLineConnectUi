import {ZodIssueCode} from 'zod'

export class UnexpectedValueError<T> extends Error {
  constructor(public v: T) {
    super(`UnexpectedValueError(${v})`)
  }

  toString() {
    return `UnexpectedValueError(${this.v})`
  }
}

export class NotInitedError extends Error {
  constructor() {
    super('NotInitedError')
  }
}

export class NotParsedError extends Error {
  constructor() {
    super('NotParsedError')
  }
}

export interface ValueError {
  code: string
  message: string
  path?: string
}

export class ValueFailure extends Error {
  constructor(public val: any, public errors: ValueError[]) {
    // Use error.message if error is custom otherwise use error.code
    const errorStrs = errors?.map(e =>
      e.code === ZodIssueCode.custom ? e.message : e.code
    )
    super(errorStrs.join(','))
  }

  toString() {
    return `[${this.val}: ${this.errors}]`
  }
}
