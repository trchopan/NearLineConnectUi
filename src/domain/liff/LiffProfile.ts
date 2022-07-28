import {Entity} from '@/domain/core/Entity'
import {DisplayNameValue} from './DisplayNameValue'
import {UrlValue} from './UrlValue'
import {LineId} from './LineId'

interface LiffProfileProps {
  displayName: DisplayNameValue
  pictureUrl: UrlValue
  token: String
}

export class LiffProfile extends Entity<LiffProfileProps, LineId> {
  constructor(props: LiffProfileProps, _id: LineId) {
    super(props, _id)
  }

  get lineId() {
    return this._id
  }

  get displayName() {
    return this.props.displayName
  }

  get pictureUrl() {
    return this.props.pictureUrl
  }

  get token() {
    return this.props.token
  }
}

export class LiffProfileMapper {
  // static toDTO({userId, displayName, pictureUrl}: LiffProfile): object {}

  static toDomain(v: any): LiffProfile {
    const {userId, displayName, pictureUrl, token} = v || {}
    return new LiffProfile(
      {
        displayName: new DisplayNameValue(displayName),
        pictureUrl: new UrlValue(pictureUrl),
        token,
      },
      new LineId(userId)
    )
  }

  // TODO static toPersist(sp: LiffProfile) {}
}
