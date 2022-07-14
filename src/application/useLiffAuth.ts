import type {UserProfile} from '@/domain/liff/UserProfile'
import {LiffRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import type {LiffError} from '@/domain/liff/ILiffRepo'
import {derived, writable} from 'svelte/store'
import {Result} from '@/application/result'

export const userProfile = writable(new Result<UserProfile, LiffError>())

export const errorXlt = derived(userProfile, $userProfile => {
  return $userProfile.fold(
    () => '',
    () => '',
    () => '',
    err => err.errorXlt
  )
})

export const authCheck = async () => {
  userProfile.update(v => v.setLoading())
  await pipe(
    LiffRepo.initLiff(),
    T.delay(3000), // Simulate loading
    TE.chainW(() => LiffRepo.getUserProfile()),
    TE.fold(
      err => T.of(userProfile.update(v => v.setError(err))),
      res => T.of(userProfile.update(v => v.setValue(res)))
    )
  )()
}

export const login = async () => {
  userProfile.update(v => v.setLoading())
  await pipe(
    TE.fromEither(LiffRepo.login()),
    T.delay(1000), // Simulate loading
    TE.fold(
      err => T.of(userProfile.update(v => v.setError(err))),
      _ => T.of(userProfile.update(v => v.setValue(null)))
    )
  )()
}

export const logout = async () => {
  userProfile.update(v => v.setLoading())
  await pipe(
    TE.fromEither(LiffRepo.logout()),
    T.delay(1000), // Simulate loading
    TE.chainW(() => LiffRepo.getUserProfile()),
    TE.fold(
      err => T.of(userProfile.update(v => v.setError(err))),
      _ => T.of(userProfile.update(v => v.reset()))
    )
  )()
}
