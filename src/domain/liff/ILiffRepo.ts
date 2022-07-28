import type {LiffProfile} from './LiffProfile'
import type * as TE from 'fp-ts/TaskEither'
import type * as E from 'fp-ts/Either'
import type {LiffAcccessToken} from './LiffAccessToken'

export enum LiffErrorCode {
  ServerError = 'ServerError',
  NetworkError = 'NetworkError',
  InitializeSDKError = 'InitializeSDKError',
  ProfileNotExist = 'ProfileNotExist',
  UnexpectedLoggoutError = 'UnexpectedLoggoutError',
}

export class LiffError extends Error {
  constructor(public code: LiffErrorCode, public error?: any) {
    super(code)
  }

  get errorXlt() {
    switch (this.code) {
      case LiffErrorCode.NetworkError:
        return 'liff.network-error'
      default:
        return 'liff.unknown-error'
    }
  }
}

export interface ILiffRepo {
  initLiff(): TE.TaskEither<LiffError, void>
  getLiffProfile(): TE.TaskEither<LiffError, LiffProfile>
  getLiffAccessToken(): E.Either<LiffError, LiffAcccessToken>
  login(): E.Either<LiffError, void>
  logout(): E.Either<LiffError, void>
}
