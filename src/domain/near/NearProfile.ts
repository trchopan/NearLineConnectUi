import {Entity} from '@/domain/core/Entity'
import {NearId} from './NearId'
import {NearNetworkValue} from './NearNetworkIdValue'

/**
ConnectedNearAccount {accessKeyByPublicKeyCache: {…}, connection: Connection, accountId: 'choptr.testnet', walletConnection: NearConnection}
accessKeyByPublicKeyCache: {}
accountId: "choptr.testnet"
connection: Connection
  jsvmAccountId: "jsvm.testnet"
  networkId: "testnet"
  provider: JsonRpcProvider {connection: {…}}
  signer: InMemorySigner {keyStore: BrowserLocalStorageKeyStore}
  [[Prototype]]: Object
walletConnection: NearConnection
  _authData: {accountId: 'choptr.testnet', allKeys: Array(1)}
  _authDataKey: "dev-1654171545868-56340066651726_wallet_auth_key"
  _connectedAccount: ConnectedNearAccount {accessKeyByPublicKeyCache: {…}, connection: Connection, accountId: 'choptr.testnet', walletConnection: NearConnection}
  _keyStore: BrowserLocalStorageKeyStore {localStorage: Storage, prefix: 'near-api-js:keystore:'}
  _near: Near {config: {…}, connection: Connection, accountCreator: UrlAccountCreator}
  _networkId: "testnet"
  _walletBaseUrl: "https://wallet.testnet.near.org"
  [[Prototype]]: Object
  ready: (...)
[[Prototype]]: Account
  accessKeyForTransaction: async accessKeyForTransaction(receiverId, actions, localKey) { const accessKeys = await this.getAccessKeys(); if (localKey) { const accessKey = accessKeys.find((key) => {…}
  accessKeyMatchesTransaction: ƒ async accessKeyMatchesTransaction(accessKey, receiverId, actions)
  constructor: class extends
  signAndSendTransaction: ƒ signAndSendTransaction(...args)
  _signAndSendTransaction: async _signAndSendTransaction({ receiverId, actions, walletMeta, walletCallbackUrl = window.location.href }) { const localKey = await this.connection.signer.getPublicKey(this.accountId, this.connection.networkId); let accessKey = await this.accessKeyForTransaction(receiverId, actions, localKey); if (!accessKey) { throw new Error(`Cannot find matching key for transaction sent to ${receiverId}`); } if (localKey && localKey.toString() === accessKey.public_key) { try { return await super.signAndSendTransaction({ receiverId, actions }); } catch (e) { if (e.type === "NotEnoughAllowance") { accessKey = await this.accessKeyForTransaction(receiverId, actions); } else { throw e; } } } const block = await this.connection.provider.block({ finality: "final" }); const blockHash = borsh_1.baseDecode(block.header.hash); const publicKey = utils_1.PublicKey.from(accessKey.public_key); const nonce = accessKey.access_key.nonce + 1; const transaction = transaction_1.createTransaction(this.accountId, publicKey, receiverId, nonce, actions, blockHash); await this.walletConnection.requestSignTransactions({ transactions: [transaction], meta: walletMeta, callbackUrl: walletCallbackUrl }); return new Promise((resolve, reject) => {…}
  ready: (...)
*/

interface NearProfileProps {
  accountId: NearId
  network: NearNetworkValue
}

export class NearProfile extends Entity<NearProfileProps, NearId> {
  constructor(props: NearProfileProps, _id: NearId) {
    super(props, _id)
  }

  get nearId() {
    return this._id
  }

  get accountId() {
    return this.props.accountId
  }

  get network() {
    return this.props.network
  }
}

export class NearProfileMapper {
  static toDTO({network, accountId}: NearProfile): object {
    return {
      accountId: accountId.getOrCrash(),
      network: network.getOrCrash(),
    }
  }

  static toDomain(val: any): NearProfile {
    const {accountId} = val
    const networkId = val?.connection?.networkId
    try {
      return new NearProfile(
        {
          accountId: new NearId(accountId),
          network: new NearNetworkValue(networkId),
        },
        new NearId(accountId)
      )
    } catch (err) {}
  }

  // TODO static toPersist(sp: NearProfile) {}
}
