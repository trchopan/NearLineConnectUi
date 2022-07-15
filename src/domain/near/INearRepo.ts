import type * as TE from 'fp-ts/TaskEither'
import type * as E from 'fp-ts/Either'
import type {NearProfile} from './NearProfile'

export enum NearErrorCode {
  ServerError = 'ServerError',
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
   * Initialize the Near network given the configuration in the repo constructor
   *
   * Example:
   * ```typescript
   * const NearRepo: INearRepo = new _NearRepo(
   *   nearBrowserLocalStorage(getConfig('development')),
   *   'staking-contract.testnet'
   * )
   *
   * NearRepo.initNear()
   * ```
   **/
  initNear(): TE.TaskEither<NearError, void>

  /**
   *
   * Get the current Near Account information. This is distinguish from the Liff Profile.
   * If not found account in current Storage. It will throw `NearError.AccountNotFound`.
   **/
  getNearProfile(): TE.TaskEither<NearError, NearProfile>

  /**
   *
   * Navigate to NEAR wallet page to perform login.
   * Configuration for the wallet Url can be found in the `infrastructure/NearRepo.ts`
   * Under `getConfig(env)`
   **/
  login(): TE.TaskEither<NearError, void>

  /**
   *
   * Perform logout and cleanup `Storage` of the current `Account`
   **/
  logout(): E.Either<NearError, void>
}
