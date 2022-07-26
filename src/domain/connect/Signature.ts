import {Entity} from '@/domain/core/Entity'
import {SignatureId} from './SignatureId'

interface SignatureProps {
  signature: string
  expire: Date
}

export class Signature extends Entity<
  SignatureProps,
  SignatureId
> {
  constructor(props: SignatureProps, _id: SignatureId) {
    super(props, _id)
  }

  get signatureId() {
    return this._id
  }

  get signature() {
    return this.props.signature
  }

  get expire() {
    return this.props.expire
  }
}

export class SignatureMapper {
  // static toDTO({network, accountId}: Signature): object {}

  static toDomain(val: any): Signature {
    const {signature, expire} = val || {}
    return new Signature(
      {
        signature,
        expire: new Date(expire),
      },
      new SignatureId('')
    )
  }

  // TODO static toPersist(sp: Signature) {}
}
