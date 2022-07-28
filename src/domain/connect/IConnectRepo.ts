import type {Signature} from './Signature'
import type * as TE from 'fp-ts/TaskEither'
import type {NearId} from '../near/NearId'
import type {LineId} from '../liff/LineId'

export enum ConnectErrorCode {
  ServerError = 'ServerError',
  NetworkError = 'NetworkError',
  InitializeSDKError = 'InitializeSDKError',
  ProfileNotExist = 'ProfileNotExist',
  UnexpectedLoggoutError = 'UnexpectedLoggoutError',
}

export class ConnectError extends Error {
  constructor(public code: ConnectErrorCode, public error?: any) {
    super(code)
  }

  get errorXlt() {
    switch (this.code) {
      case ConnectErrorCode.NetworkError:
        return 'liff.network-error'
      default:
        return 'liff.unknown-error'
    }
  }
}

export interface IConnectRepo {
  getRegistrationSignature(info: {
    line_id: LineId
    wallet_id: NearId
    token: string
  }): TE.TaskEither<ConnectError, Signature>
}
