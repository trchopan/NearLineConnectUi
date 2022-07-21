import type {ValueObject} from '@/domain/core/ValueObject'
import {isNull, isUndefined} from 'lodash'

export class EntityCorrupted extends Error {
  constructor(msg: string, err?: any) {
    super(msg)
    console.error(msg, err)
  }
}

export const isEntity = (v: any): v is Entity<any, ValueObject<any>> => {
  return v instanceof Entity
}

export abstract class Entity<Props, ID extends ValueObject<any>> {
  constructor(protected props: Props, protected _id: ID) {}

  public equals(object?: Entity<Props, ID>): boolean {
    return (
      !isUndefined(object) &&
      !isNull(object) &&
      isEntity(object) &&
      Boolean(this._id?.equals(object._id))
    )
  }
}
