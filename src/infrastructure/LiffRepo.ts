import {LiffProfile, LiffProfileMapper} from '@/domain/liff/LiffProfile'
import {ILiffRepo, LiffError, LiffErrorCode} from '@/domain/liff/ILiffRepo'
import type {Liff} from '@liff/liff-types'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {pipe} from 'fp-ts/function'
import {
  LiffAcccessToken,
  LiffAcccessTokenMapper,
} from '@/domain/liff/LiffAccessToken'
import type {NonfungibleInfo} from '@/domain/near/NonfungibleInfo'

export class _LiffRepo implements ILiffRepo {
  constructor(private liff: Liff) {}

  initLiff(): TE.TaskEither<LiffError, void> {
    const liffInitPromise = new Promise<void>((resolve, reject) =>
      this.liff.init(
        {
          liffId: '1657284859-PZjvVAyL',
          // withLoginOnExternalBrowser: true,
        },
        () => resolve(),
        err => reject(err)
      )
    )
    return TE.tryCatch(
      () => liffInitPromise,
      err => {
        console.error(err)
        switch (err as string) {
          case 'network-error':
            return new LiffError(LiffErrorCode.NetworkError, err)
          default:
            return new LiffError(LiffErrorCode.InitializeSDKError, err)
        }
      }
    )
  }

  getLiffProfile(): TE.TaskEither<LiffError, LiffProfile> {
    return pipe(
      TE.tryCatch(
        () => this.liff.getProfile(),
        err => {
          console.error(err)
          switch (err as string) {
            case 'profile-not-exist':
              return new LiffError(LiffErrorCode.ProfileNotExist, err)
            default:
              return new LiffError(LiffErrorCode.ServerError, err)
          }
        }
      ),
      TE.map(LiffProfileMapper.toDomain)
    )
  }

  getLiffAccessToken(): E.Either<LiffError, LiffAcccessToken> {
    return pipe(
      E.tryCatch(
        () => this.liff.getAccessToken(),
        err => {
          console.error(err)
          return new LiffError(LiffErrorCode.ServerError, err)
        }
      ),
      E.map(v => LiffAcccessTokenMapper.toDomain(v, this.liff.id))
    )
  }

  login(): E.Either<LiffError, void> {
    return E.tryCatch(
      () => this.liff.login({redirectUri: document.location.href}),
      err => {
        console.error(err)
        return new LiffError(LiffErrorCode.ServerError, err)
      }
    )
  }

  logout(): E.Either<LiffError, void> {
    return E.tryCatch(
      () => this.liff.logout(),
      err => {
        console.error(err)
        return new LiffError(LiffErrorCode.UnexpectedLoggoutError, err)
      }
    )
  }
}
