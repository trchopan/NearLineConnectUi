import type * as TE from 'fp-ts/TaskEither'
import type * as E from 'fp-ts/Either'
import type {NearProfile} from './NearProfile'
import type {FaucetInfo} from './FaucetInfo'
import type { FaucetSharedBalance } from './FaucetSharedBalance'

export enum NearErrorCode {
  ContractError = 'ServerError',
  NetworkError = 'NetworkError',
  InitializeSDKError = 'InitializeSDKError',
  NotSignedIn = 'NotSignedIn',
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
  /**
   *
   * Get the current Near Account information. This is distinguish from the Liff Profile.
   * If not found account in current Storage. It will throw `NearError.AccountNotFound`.
   **/
  getNearProfile(): TE.TaskEither<NearError, NearProfile>

  /**
   * Navigate to NEAR wallet page to perform login.
   * Configuration for the wallet Url can be found in the `infrastructure/NearRepo.ts`
   * Under `getConfig(env)`
   **/
  login(): TE.TaskEither<NearError, void>

  /**
   * Perform logout and cleanup `Storage` of the current `Account`
   **/
  logout(): E.Either<NearError, void>

  /**
   * Get the information of the Faucet Contract
   **/
  getFaucetInfo(): TE.TaskEither<NearError, FaucetInfo>

  /**
   * Get the current wallet shared balance
   **/
  getFaucetSharedBalance(): TE.TaskEither<NearError, FaucetSharedBalance>
}
