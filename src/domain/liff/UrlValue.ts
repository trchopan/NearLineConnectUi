import {z} from 'zod'
import {ValueObject} from '@/domain/core/ValueObject'

const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/

export class UrlValue extends ValueObject<string> {
  protected name = 'TimebasedId'
  protected schema = z.string().regex(urlRegex)

  constructor(_input: string) {
    super(_input)
    this.parse()
  }
}
