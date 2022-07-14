import {INearRepo, NearError, NearErrorCode} from '@/domain/near/INearRepo'
import {Near, keyStores, WalletConnection} from 'near-api-js'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {pipe} from 'fp-ts/function'
import type {NearConfig} from 'near-api-js/lib/near'
import {NearProfile, NearProfileMapper} from '@/domain/near/NearProfile'

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

  constructor(private near: Near, private contract: string) {}

  initNear(): TE.TaskEither<NearError, void> {
    return TE.tryCatch(
      () =>
        new Promise(resolve => {
          this.wallet = new WalletConnection(this.near, this.contract)
          resolve()
        }),
      err => {
        console.error(err)
        switch (err as string) {
          case 'network-error':
            return new NearError(NearErrorCode.NetworkError, err)
          default:
            return new NearError(NearErrorCode.InitializeSDKError, err)
        }
      }
    )
  }

  getNearProfile(): TE.TaskEither<NearError, NearProfile> {
    return pipe(
      TE.tryCatch(
        () =>
          new Promise((resolve, reject) => {
            const account = this.wallet.account()
            if (!account.accountId) throw 'account-not-found'
            resolve(account)
          }),
        err => {
          console.error(err)
          switch (err as string) {
            case 'profile-not-exist':
              return new NearError(NearErrorCode.ProfileNotExist, err)
            case 'account-not-found':
              return new NearError(NearErrorCode.AccountNotFound, err)
            default:
              return new NearError(NearErrorCode.ServerError, err)
          }
        }
      ),
      TE.map(NearProfileMapper.toDomain)
    )
  }

  login(): TE.TaskEither<NearError, void> {
    return TE.tryCatch(
      () => this.wallet.requestSignIn(''),
      err => {
        console.error(err)
        return new NearError(NearErrorCode.ServerError, err)
      }
    )
  }

  logout(): E.Either<NearError, void> {
    return E.tryCatch(
      () => this.wallet.signOut(),
      err => {
        console.error(err)
        return new NearError(NearErrorCode.UnexpectedLoggoutError, err)
      }
    )
  }
}
