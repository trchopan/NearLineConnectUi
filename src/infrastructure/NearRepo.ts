import BN from 'bn.js'
import {baseDecode} from 'borsh'
import {INearRepo, NearError, NearErrorCode} from '@/domain/near/INearRepo'
import {
  Near,
  keyStores,
  WalletConnection,
  Contract,
  ConnectedWalletAccount,
  utils,
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
import {
  Action,
  createTransaction,
  functionCall,
} from 'near-api-js/lib/transaction'
import {PublicKey} from 'near-api-js/lib/utils'
import {
  FungibleStorageBalance,
  FungibleStorageBalanceMapper,
} from '@/domain/near/FungibleStorageBalance'
import * as O from 'fp-ts/lib/Option'

export const STAKING_STORAGE_AMOUNT = '0.01'
export const FT_STORAGE_AMOUNT = '0.01'
export const ONE_YOCTO_NEAR = '0.000000000000000000000001'

interface FunctionCallObj {
  methodName: string
  args?: object
  gas?: string
  deposit?: string
}

interface TransactionCall {
  receiverId: string
  functionCalls: FunctionCallObj[]
}

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
  private fungibleTokenContract: Contract
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

  private readonly fungibleTokenContractMethods: ContractMethods = {
    viewMethods: ['ft_metadata', 'ft_balance_of', 'storage_balance_of'],
    changeMethods: ['ft_transfer', 'ft_transfer_call'],
  }

  constructor(
    near: Near,
    contracts: {
      staking: string
      faucet: string
      fungible: string
    }
  ) {
    const appKeyPrefix = null
    this.wallet = new WalletConnection(near, appKeyPrefix)

    this.connectedWallet = new ConnectedWalletAccount(
      this.wallet,
      near.connection,
      this.wallet.getAccountId()
    )

    this.fungibleTokenContract = new Contract(
      this.wallet.account(),
      contracts.fungible,
      this.fungibleTokenContractMethods
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

  getFungibleStorageBalance(): TE.TaskEither<
    NearError,
    FungibleStorageBalance
  > {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.fungibleTokenContract.storage_balance_of({
            account_id: this.wallet.getAccountId(),
          })
        },
        err => {
          console.error('getFungibleStorageBalance', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(FungibleStorageBalanceMapper.toDomain)
    )
  }

  claimFaucetTokens(amount: string): TE.TaskEither<NearError, void> {
    const storageDepositTransaction: TransactionCall = {
      receiverId: this.fungibleTokenContract.contractId,
      functionCalls: [
        {
          methodName: 'storage_deposit',
          args: {
            account_id: this.wallet.getAccountId(),
          },
          gas: '10000000000000',
          deposit: FT_STORAGE_AMOUNT,
        },
      ],
    }
    const getTokenTransaction: TransactionCall = {
      receiverId: this.faucetContract.contractId,
      functionCalls: [
        {
          methodName: 'get_token',
          args: {
            amount,
          },
          gas: '60000000000000',
          deposit: FT_STORAGE_AMOUNT,
        },
      ],
    }
    return pipe(
      this.getNearProfile(),
      TE.chainW(() => this.getFungibleStorageBalance()),
      TE.map(
        m =>
          m.balance
            .fold<TransactionCall[]>(
              () => [storageDepositTransaction], // Not yet has storage deposit
              () => [] // Already has storage. No need to deposit.
            )
            .concat(getTokenTransaction) // Transactions: [storage_deposit?, get_token]
      ),
      TE.chainW(transactions =>
        TE.tryCatch(
          () => this.executeMultipleTransactions(transactions),
          err => {
            console.error('claimToken', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  // FACADE FUNCTIONS
  // TODO The below can be moved to another file but put it here for now

  private async _createTransaction({
    receiverId,
    actions,
    nonceOffset = 1,
  }: {
    receiverId: string
    actions: Action[]
    nonceOffset?: number
  }) {
    const connection = this.connectedWallet.connection
    const accountId = this.wallet.getAccountId()
    const localKey = await connection.signer.getPublicKey(
      accountId,
      connection.networkId
    )
    let accessKey = await this.connectedWallet.accessKeyForTransaction(
      receiverId,
      actions,
      localKey
    )
    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${receiverId}`
      )
    }

    const block = await connection.provider.block({finality: 'final'})
    const blockHash = baseDecode(block.header.hash)

    const publicKey = PublicKey.from(accessKey.public_key)
    const nonce = accessKey.access_key.nonce + nonceOffset

    return createTransaction(
      accountId,
      publicKey,
      receiverId,
      nonce,
      actions,
      blockHash
    )
  }

  private async executeMultipleTransactions(
    transactions: TransactionCall[],
    callbackUrl?: string,
    meta?: string
  ) {
    const rawTransaction = await Promise.all(
      transactions.map((t, i) => {
        return this._createTransaction({
          receiverId: t.receiverId,
          nonceOffset: i + 1,
          actions: t.functionCalls.map(fc =>
            functionCall(
              fc.methodName,
              Buffer.from(JSON.stringify(fc.args)),
              new BN(fc.gas || '100000000000000'),
              new BN(utils.format.parseNearAmount(fc.deposit))
            )
          ),
        })
      })
    )

    return await this.wallet.requestSignTransactions({
      transactions: rawTransaction,
      callbackUrl,
      meta,
    })
  }
}
