import {Entity} from '@/domain/core/Entity'
import {DisplayNameValue} from '@/domain/liff/DisplayNameValue'
import {UrlValue} from '@/domain/liff/UrlValue'
import {LineId} from '@/domain/liff/LineId'

interface LineProfileProps {
  name: DisplayNameValue
  picture: UrlValue
}

export class LineProfile extends Entity<LineProfileProps, LineId> {
  constructor(props: LineProfileProps, _id: LineId) {
    super(props, _id)
  }

  get lineId() {
    return this._id
  }

  get name() {
    return this.props.name
  }

  get picture() {
    return this.props.picture
  }
}

export class LineProfileMapper {
  // static toDTO({userId, displayName, pictureUrl}: LineProfile): object {}

  static toDomain(v: any): LineProfile {
    const {sub, name, picture} = v || {}
    return new LineProfile(
      {
        name: new DisplayNameValue(name),
        picture: new UrlValue(picture),
      },
      new LineId(sub)
    )
  }

  // TODO static toPersist(sp: LineProfile) {}
}
