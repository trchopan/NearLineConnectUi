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
import {
  StakingPoolInfo,
  StakingPoolInfoMapper,
} from '@/domain/near/StakingPoolInfo'
import {
  StakingAccountInfo,
  StakingAccountInfoMapper,
} from '@/domain/near/StakingAccountInfo'
import {
  FungibleAccountBalance,
  FungibleAccountBalanceMapper,
} from '@/domain/near/FungibleAccountBalance'
import {NearId} from '@/domain/near/NearId'
import {
  NonfungibleInfoList,
  NonfungibleInfoListMapper,
} from '@/domain/near/NonfungibleInfoList'
import {
  NonfungibleInfo,
  NonfungibleInfoMapper,
} from '@/domain/near/NonfungibleInfo'
import {LineId} from '@/domain/liff/LineId'
import type {NonfungibleTokenId} from '@/domain/near/NonfungibleTokenId'
import type {BigNumberValue} from '@/domain/near/BigNumberValue'

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
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        headers: {},
      }
    case 'production':
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
  private nonfungibleTokenContract: Contract
  private nearLineConnectContract: Contract

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

  private readonly nonfungibleTokenContractMethods: ContractMethods = {
    viewMethods: ['nft_token', 'nft_tokens', 'nft_tokens_for_owner'],
    changeMethods: ['nft_mint'],
  }

  private readonly nearLineConnectMethods: ContractMethods = {
    viewMethods: ['get_line_id_by_wallet'],
    changeMethods: ['record_line_id_by_wallet', 'remove_line_id_by_wallet'],
  }

  constructor(
    near: Near,
    contracts: {
      staking: string
      faucet: string
      fungible: string
      nonfungible: string
      nearLineConnect: string
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

    this.fungibleTokenContract = new Contract(
      this.wallet.account(),
      contracts.fungible,
      this.fungibleTokenContractMethods
    )

    this.nonfungibleTokenContract = new Contract(
      this.wallet.account(),
      contracts.nonfungible,
      this.nonfungibleTokenContractMethods
    )

    this.nearLineConnectContract = new Contract(
      this.wallet.account(),
      contracts.nearLineConnect,
      this.nearLineConnectMethods
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

  getFungibleAccountBalance(): TE.TaskEither<
    NearError,
    FungibleAccountBalance
  > {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.fungibleTokenContract.ft_balance_of({
            account_id: this.wallet.getAccountId(),
          })
        },
        err => {
          console.error('getFungibleBalance', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(v =>
        FungibleAccountBalanceMapper.toDomain(v, this.wallet.getAccountId())
      )
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
      TE.map(m => {
        return m.total
          .fold<TransactionCall[]>(
            () => [storageDepositTransaction], // Not yet has storage deposit
            () => [] // Already has storage. No need to deposit.
          )
          .concat(getTokenTransaction) // Transactions: [storage_deposit?, get_token]
      }),
      TE.chainW(transactions =>
        TE.tryCatch(
          () => this.executeMultipleTransactions(transactions),
          err => {
            console.error('claimFaucetTokens', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  getStakingAccountInfo(): TE.TaskEither<NearError, StakingAccountInfo> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.stakingContract.get_account_info({
            account_id: this.wallet.getAccountId(),
          })
        },
        err => {
          console.error('getStakingAccountInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(StakingAccountInfoMapper.toDomain)
    )
  }

  getStakingPoolInfo(): TE.TaskEither<NearError, StakingPoolInfo> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.stakingContract.get_pool_info()
        },
        err => {
          console.error('getStakingPoolInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(StakingPoolInfoMapper.toDomain)
    )
  }

  transferFungibleToken(
    receiver_id: NearId,
    amount: BN,
    memo?: string
  ): TE.TaskEither<NearError, void> {
    const transferTransaction: TransactionCall = {
      receiverId: this.fungibleTokenContract.contractId,
      functionCalls: [
        {
          methodName: 'ft_transfer',
          args: {
            receiver_id: receiver_id.getOrCrash(),
            amount: amount.toString(),
            memo,
          },
          gas: '60000000000000',
          deposit: ONE_YOCTO_NEAR,
        },
      ],
    }
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => this.executeMultipleTransactions([transferTransaction]),
          err => {
            console.error('transferFungibleToken', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  stakeFungibleToken(amount: string): TE.TaskEither<NearError, void> {
    const storageDepositTransaction: TransactionCall = {
      receiverId: this.stakingContract.contractId,
      functionCalls: [
        {
          methodName: 'storage_deposite',
          args: {
            account_id: this.wallet.getAccountId(),
          },
          gas: '10000000000000',
          deposit: STAKING_STORAGE_AMOUNT,
        },
      ],
    }
    const fungibleTokenTransferTransaction: TransactionCall = {
      receiverId: this.fungibleTokenContract.contractId,
      functionCalls: [
        {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: this.stakingContract.contractId,
            amount,
            msg: '',
          },
          gas: '60000000000000',
          deposit: ONE_YOCTO_NEAR,
        },
      ],
    }
    return pipe(
      this.getNearProfile(),
      TE.chainW(() => this.getFungibleStorageBalance()),
      TE.map(
        m =>
          m.total
            .fold<TransactionCall[]>(
              () => [storageDepositTransaction], // Not yet has storage deposit
              () => [] // Already has storage. No need to deposit.
            )
            .concat(fungibleTokenTransferTransaction) // Transactions: [storage_deposit?, get_token]
      ),
      TE.chainW(transactions =>
        TE.tryCatch(
          () => this.executeMultipleTransactions(transactions),
          err => {
            console.error('stakeFungibleToken', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  unstakeFromStakingPool(amount: string): TE.TaskEither<NearError, void> {
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => {
            // @ts-ignore:next-line
            await this.stakingContract.un_stake({amount}, 30000000000000, 1)
          },
          err => {
            console.error('unstakeFromStakingPool', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  havestFromStakingPool(): TE.TaskEither<NearError, void> {
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => {
            // @ts-ignore:next-line
            await this.stakingContract.harvest({}, 60000000000000, 1)
          },
          err => {
            console.error('havestFromStakingPool', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  withdrawFromStakingPool(): TE.TaskEither<NearError, void> {
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => {
            // @ts-ignore:next-line
            await this.stakingContract.withdraw({}, 60000000000000, 1)
          },
          err => {
            console.error('withdrawFromStakingPool', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  getAllNonFungibleTokensInfo(): TE.TaskEither<NearError, NonfungibleInfoList> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.nonfungibleTokenContract.nft_tokens()
        },
        err => {
          console.error('getNonFungibleTokensInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(NonfungibleInfoListMapper.toDomain)
    )
  }

  getMyNonFungibleTokensInfo(): TE.TaskEither<NearError, NonfungibleInfoList> {
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        this.getNonFungibleTokensInfo(new NearId(this.wallet.getAccountId()))
      )
    )
  }

  getNonFungibleTokensInfo(
    walletId: NearId
  ): TE.TaskEither<NearError, NonfungibleInfoList> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.nonfungibleTokenContract.nft_tokens_for_owner({
            account_id: walletId.getOrCrash(),
          })
        },
        err => {
          console.error('getNonFungibleTokensInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(NonfungibleInfoListMapper.toDomain)
    )
  }

  getSingleNonFungibleTokensInfo(
    tokenId: string
  ): TE.TaskEither<NearError, NonfungibleInfo> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.nonfungibleTokenContract.nft_token({
            token_id: tokenId,
          })
        },
        err => {
          console.error('getSingleNonFungibleTokensInfo', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(NonfungibleInfoMapper.toDomain)
    )
  }

  recordLineId(
    signature: string,
    line_id: LineId,
    wallet: NearId,
    expire: number
  ): TE.TaskEither<NearError, void> {
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => {
            // @ts-ignore:next-line
            await this.nearLineConnectContract.record_line_id_by_wallet(
              {
                signature,
                line_id: line_id.getOrCrash(),
                wallet: wallet.getOrCrash(),
                expire,
              },
              30000000000000,
              1
            )
          },
          err => {
            console.error('recordLineId', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  removeLineId(
    signature: string,
    line_id: LineId,
    wallet: NearId,
    expire: number
  ): TE.TaskEither<NearError, void> {
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => {
            // @ts-ignore:next-line
            await this.nearLineConnectContract.remove_line_id_by_wallet(
              {
                signature,
                line_id: line_id.getOrCrash(),
                wallet: wallet.getOrCrash(),
                expire,
              },
              30000000000000,
              1
            )
          },
          err => {
            console.error('removeLineId', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  getLineIdByWallet(walletId: NearId): TE.TaskEither<NearError, LineId> {
    return pipe(
      TE.tryCatch(
        async () => {
          // @ts-ignore:next-line
          return await this.nearLineConnectContract.get_line_id_by_wallet({
            wallet: walletId.getOrCrash(),
          })
        },
        err => {
          console.error('getLineIdByWallet', err)
          return new NearError(NearErrorCode.ContractError, err)
        }
      ),
      TE.map(v => new LineId(v))
    )
  }

  mintNonFungibleToken(t: NonfungibleInfo): TE.TaskEither<NearError, void> {
    const mintTransaction: TransactionCall = {
      receiverId: this.nonfungibleTokenContract.contractId,
      functionCalls: [
        {
          methodName: 'nft_mint',
          args: NonfungibleInfoMapper.toPersist(t),
          gas: '60000000000000',
          deposit: '0.015',
        },
      ],
    }
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          async () => this.executeMultipleTransactions([mintTransaction]),
          err => {
            console.error('mintNonFungibleToken', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  buyNonFungibleToken(
    token_id: NonfungibleTokenId,
    amount: BigNumberValue
  ): TE.TaskEither<NearError, void> {
    const purchaseTransaction: TransactionCall = {
      receiverId: this.fungibleTokenContract.contractId,
      functionCalls: [
        {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: this.nonfungibleTokenContract.contractId,
            amount: amount.toString(),
            msg: JSON.stringify({token_ids: [token_id.getOrCrash()]}),
          },
          gas: '60000000000000',
          deposit: ONE_YOCTO_NEAR,
        },
      ],
    }
    return pipe(
      this.getNearProfile(),
      TE.chainW(() =>
        TE.tryCatch(
          () => this.executeMultipleTransactions([purchaseTransaction]),
          err => {
            console.error('stakeFungibleToken', err)
            return new NearError(NearErrorCode.ContractError, err)
          }
        )
      )
    )
  }

  // FACADE FUNCTIONS
  // TODO The below can be refactored to another file but put it here for now

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
