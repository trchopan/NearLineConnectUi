import type {LiffProfile} from '@/domain/liff/LiffProfile'
import {LiffRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import type {LiffError} from '@/domain/liff/ILiffRepo'
import {derived, writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {LiffAcccessToken} from '@/domain/liff/LiffAccessToken'
import { lineIdByWallet } from './useNearLineConnect'

export const liffProfile = writable(new Result<LiffProfile, LiffError>())

export const errorXlt = derived(liffProfile, $liffProfile => {
  return $liffProfile.match({
    notInited: () => '',
    loading: () => '',
    hasData: () => '',
    hasError: err => err.errorXlt,
  })
})

export const authCheck = async () => {
  liffProfile.update(v => v.setLoading())
  await pipe(
    LiffRepo.initLiff(),
    T.delay(3000), // Simulate loading
    TE.chainW(() => LiffRepo.getLiffProfile()),
    TE.fold(
      err => T.of(liffProfile.update(v => v.setError(err))),
      res => T.of(liffProfile.update(v => v.setValue(res)))
    )
  )()
}

export const liffAccessToken = writable(
  new Result<LiffAcccessToken, LiffError>()
)

export const getLiffAccessToken = async () => {
  liffAccessToken.update(v => v.setLoading())
  await pipe(
    TE.fromEither(LiffRepo.getLiffAccessToken()),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(liffAccessToken.update(v => v.setError(err))),
      res => T.of(liffAccessToken.update(v => v.setValue(res)))
    )
  )()
}

export const login = async () => {
  liffProfile.update(v => v.setLoading())
  await pipe(
    TE.fromEither(LiffRepo.login()),
    T.delay(1000), // Simulate loading
    TE.fold(
      err => T.of(liffProfile.update(v => v.setError(err))),
      _ => T.of(liffProfile.update(v => v.setValue(null)))
    )
  )()
}

export const logout = async () => {
  liffProfile.update(v => v.setLoading())
  await pipe(
    TE.fromEither(LiffRepo.logout()),
    T.delay(1000), // Simulate loading
    TE.fold(
      err => T.of(liffProfile.update(v => v.setError(err))),
      _ => {
        lineIdByWallet.update(v => v.reset())
        return T.of(liffProfile.update(v => v.reset()))
      }
    )
  )()
}
