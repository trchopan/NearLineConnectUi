import {Entity} from '@/domain/core/Entity'
import {NearId} from './NearId'
import {NearNetworkValue} from './NearNetworkValue'

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
