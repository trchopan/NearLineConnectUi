import {Entity} from '@/domain/core/Entity'
import {DisplayNameValue} from './DisplayNameValue'
import {UrlValue} from './UrlValue'
import {LiffId} from './LiffId'

interface LiffProfileProps {
  displayName: DisplayNameValue
  pictureUrl: UrlValue
}

export class LiffProfile extends Entity<LiffProfileProps, LiffId> {
  constructor(props: LiffProfileProps, _id: LiffId) {
    super(props, _id)
  }

  get userId() {
    return this._id
  }

  get displayName() {
    return this.props.displayName
  }

  get pictureUrl() {
    return this.props.pictureUrl
  }
}

export class LiffProfileMapper {
  static toDTO({userId, displayName, pictureUrl}: LiffProfile): object {
    return {
      userId: userId.getOrCrash(),
      displayName: displayName.getOrCrash(),
      pictureUrl: pictureUrl.getOrCrash(),
    }
  }

  static toDomain({userId, displayName, pictureUrl}: any): LiffProfile {
    return new LiffProfile(
      {
        displayName: new DisplayNameValue(displayName),
        pictureUrl: new UrlValue(pictureUrl),
      },
      new LiffId(userId)
    )
  }

  // TODO static toPersist(sp: LiffProfile) {}
}
