import type {Signature} from './Signature'
import type * as TE from 'fp-ts/TaskEither'
import type {NearId} from '../near/NearId'
import type {LineId} from '../liff/LineId'
import type {LineProfile} from './LineProfile'

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
  /**
   * Get the registration signature to be submit by the user to NEAR blockchain.
   * Either to record his/her wallet address or remove it.
   **/
  getRegistrationSignature(info: {
    line_id: LineId
    wallet_id: NearId
    token: string
  }): TE.TaskEither<ConnectError, Signature>

  /**
   * Get the profile saved on the server for given line ID (ex: U123456abcdef...)
   **/
  getLineProfileByLineId(lineId: LineId): TE.TaskEither<ConnectError, LineProfile>
}
