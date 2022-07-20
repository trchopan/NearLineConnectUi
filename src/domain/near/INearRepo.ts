import type * as TE from 'fp-ts/TaskEither'
import type * as E from 'fp-ts/Either'
import type {NearProfile} from './NearProfile'
import type {FaucetInfo} from './FaucetInfo'
import type {FaucetSharedBalance} from './FaucetSharedBalance'
import type {FungibleStorageBalance} from './FungibleStorageBalance'
import type {StakingPoolInfo} from './StakingPoolInfo'
import type {StakingAccountInfo} from './StakingAccountInfo'
import type {FungibleAccountBalance} from './FungibleAccountBalance'

export enum NearErrorCode {
  ContractError = 'ContractError',
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

/**
 * Repository to provide the functionality of Near Protocol Smart Contracts for this application.
 * Smart Contract:
 * - Faucet
 * - Fungible Token
 * - Staking
 * - NFT
 *
 * This repository using `near-api-js` and use the current authorized wallet to submit the transactions
 * to the Near Protocol blockchain
 **/
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
   * Get the current wallet shared balance of the Faucet Contract
   **/
  getFaucetSharedBalance(): TE.TaskEither<NearError, FaucetSharedBalance>

  /**
   * Get the account balance of the Fungible Contract
   **/
  getFungibleAccountBalance(): TE.TaskEither<NearError, FungibleAccountBalance>

  /**
   * Get the storage balance of the Fungible Contract
   **/
  getFungibleStorageBalance(): TE.TaskEither<NearError, FungibleStorageBalance>

  /**
   * Claim the token from faucet. Pay the deposit if the Storage is not yet paid.
   **/
  claimFaucetTokens(amount: string): TE.TaskEither<NearError, void>

  /**
   * Get the account information of the Staking Contract
   **/
  getStakingAccountInfo(): TE.TaskEither<NearError, StakingAccountInfo>

  /**
   * Get the pool information of the Staking Contract
   **/
  getStakingPoolInfo(): TE.TaskEither<NearError, StakingPoolInfo>

  /**
   * Stake the fungible tokens from the current wallet to the Staking contract.
   * Pay the deposit if the Storage is not yet paid.
   **/
  stakeFungibleToken(amount: string): TE.TaskEither<NearError, void>

  /**
   * Unstake from the Staking contract to the current wallet.
   **/
  unstakeFromStakingPool(amount: string): TE.TaskEither<NearError, void>

  /**
   * Havest/Claim from the Staking contract to the current wallet.
   **/
  havestFromStakingPool(): TE.TaskEither<NearError, void>

  /**
   * Withdraw fungible tokens from the Staking contract to the current wallet.
   **/
  withdrawFromStakingPool(): TE.TaskEither<NearError, void>
}
