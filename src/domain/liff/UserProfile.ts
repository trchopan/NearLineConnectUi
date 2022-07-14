import {Entity} from '@/domain/core/Entity'
import {DisplayNameValue} from './DisplayNameValue'
import {UrlValue} from './UrlValue'
import {UserId} from './UserId'

interface UserProfileProps {
  displayName: DisplayNameValue
  pictureUrl: UrlValue
}

export class UserProfile extends Entity<UserProfileProps, UserId> {
  constructor(props: UserProfileProps, _id: UserId) {
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

export class UserProfileMapper {
  static toDTO({userId, displayName, pictureUrl}: UserProfile): object {
    return {
      userId: userId.getOrCrash(),
      displayName: displayName.getOrCrash(),
      pictureUrl: pictureUrl.getOrCrash(),
    }
  }

  static toDomain({userId, displayName, pictureUrl}: any): UserProfile {
    return new UserProfile(
      {
        displayName: new DisplayNameValue(displayName),
        pictureUrl: new UrlValue(pictureUrl),
      },
      new UserId(userId)
    )
  }

  // TODO static toPersist(sp: UserProfile) {}
}
