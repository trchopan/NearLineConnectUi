import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

export enum NearNetworkId {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export class NearNetworkValue extends ValueObject<string> {
  protected name = 'NearNetworkIdValue'
  protected schema = z.nativeEnum(NearNetworkId)

  constructor(_input: string) {
    super(_input)
    this.parse()
  }
}
