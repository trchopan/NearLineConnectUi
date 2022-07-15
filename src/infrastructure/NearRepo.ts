import {INearRepo, NearError, NearErrorCode} from '@/domain/near/INearRepo'
import {
  Near,
  keyStores,
  WalletConnection,
  Contract,
  ConnectedWalletAccount,
} from 'near-api-js'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {pipe} from 'fp-ts/function'
import type {NearConfig} from 'near-api-js/lib/near'
import {NearProfile, NearProfileMapper} from '@/domain/near/NearProfile'
import type {ContractMethods} from 'near-api-js/lib/contract'
import {FaucetInfo, FaucetInfoMapper} from '@/domain/near/FaucetInfo'
import {
  FaucetSharedBalance,
  FaucetSharedBalanceMapper,
} from '@/domain/near/FaucetSharedBalance'

export const getConfig = (env: string): NearConfig => {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        headers: {},
      }
    case 'development':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        headers: {},
      }
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        headers: {},
      }
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      )
  }
}

export const nearBrowserLocalStorage = (config: NearConfig) =>
  new Near({
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    ...config,
  })

export class _NearRepo implements INearRepo {
  private wallet: WalletConnection
  private connectedWallet: ConnectedWalletAccount
  private stakingContract: Contract
  private faucetContract: Contract

  private readonly stakingContractMethods: ContractMethods = {
    viewMethods: [
      'get_account_info',
      'get_account_reward',
      'get_pool_info',
      'storage_balance_of',
    ],
    changeMethods: ['storage_deposite', 'harvest', 'un_stake', 'withdraw'],
  }

  private readonly faucetContractMethods: ContractMethods = {
    viewMethods: ['get_faucet_info', 'get_shared_balance_of'],
    changeMethods: ['get_token'],
  }

  constructor(
    near: Near,
    contracts: {
      staking: string
      faucet: string
    }
  ) {
    const appKeyPrefix = null
    this.wallet = new WalletConnection(near, appKeyPrefix)

    this.connectedWallet = new ConnectedWalletAccount(
      this.wallet,
      near.connection,
      this.wallet.getAccountId()
    )

    this.stakingContract = new Contract(
      this.wallet.account(),
      contracts.staking,
      this.stakingContractMethods
    )

    this.faucetContract = new Contract(
      this.wallet.account(),
      contracts.faucet,
      this.faucetContractMethods
    )
  }

  getNearProfile(): TE.TaskEither<NearError, NearProfile> {
    return pipe(
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            if (!this.wallet.isSignedIn()) reject('not-signed-in')
            resolve(this.wallet.account())
          }),
        err => {
          console.error(err)
          switch (err as string) {
            case 'not-signed-in':
              return new NearError(NearErrorCode.NotSignedIn, err)
            default:
              return new NearError(NearErrorCode.ContractError, err)
          }
        }
      ),
      TE.map(NearProfileMapper.toDomain)
    )
  }

  login(): TE.TaskEither<NearError, void> {
    return TE.tryCatch(
      () => this.wallet.requestSignIn(),
      err => {
        console.error(err)
        return new NearError(NearErrorCode.ContractError, err)
      }
    )
  }

  logout(): E.Either<NearError, void> {
    return E.tryCatch(
      () => this.wallet.signOut(),
      err => {
        return new NearError(NearErrorCode.UnexpectedLoggoutError, err)
      }
    )
  }

  getFaucetInfo(): TE.TaskEither<NearError, FaucetInfo> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.faucetContract.get_faucet_info()
        },
        err => {
          console.error('getFaucetInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(FaucetInfoMapper.toDomain)
    )
  }

  getFaucetSharedBalance(): TE.TaskEither<NearError, FaucetSharedBalance> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.faucetContract.get_shared_balance_of({
            account_id: this.wallet.getAccountId(),
          })
        },
        err => {
          console.error('getFaucetInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(FaucetSharedBalanceMapper.toDomain)
    )
  }
}
