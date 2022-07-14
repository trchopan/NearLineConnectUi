import type * as TE from 'fp-ts/TaskEither'
import type * as E from 'fp-ts/Either'
import type {NearProfile} from './NearProfile'

export enum NearErrorCode {
  ServerError = 'ServerError',
  NetworkError = 'NetworkError',
  InitializeSDKError = 'InitializeSDKError',
  ProfileNotExist = 'ProfileNotExist',
  AccountNotFound = 'AccountNotFound',
  UnexpectedLoggoutError = 'UnexpectedLoggoutError',
}

export class NearError extends Error {
  constructor(public code: NearErrorCode, public error?: any) {
    super(code)
  }

  get errorXlt() {
    switch (this.code) {
      case NearErrorCode.NetworkError:
        return 'liff.network-error'
      default:
        return 'liff.unknown-error'
    }
  }
}

export interface INearRepo {
  initNear(): TE.TaskEither<NearError, void>
  getNearProfile(): TE.TaskEither<NearError, NearProfile>
  login(): TE.TaskEither<NearError, void>
  logout(): E.Either<NearError, void>
}
