import {Entity} from '@/domain/core/Entity'
import {LiffId} from './LiffId'

interface LiffAcccessTokenProps {
  token: string
}

export class LiffAcccessToken extends Entity<LiffAcccessTokenProps, LiffId> {
  constructor(props: LiffAcccessTokenProps, _id: LiffId) {
    super(props, _id)
  }

  get liffId() {
    return this._id
  }

  get token() {
    return this.props.token
  }
}

export class LiffAcccessTokenMapper {
  static toDomain(v: any, userId: string): LiffAcccessToken {
    console.log('>>>', v)
    return new LiffAcccessToken(
      {
        token: v,
      },
      new LiffId(userId)
    )
  }

  // TODO static toPersist(sp: LiffAcccessToken) {}
}
