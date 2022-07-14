import type {NearProfile} from '@/domain/near/NearProfile'
import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'

export const nearProfile = writable(new Result<NearProfile, NearError>())

export const authCheck = async () => {
  nearProfile.update(v => v.setLoading())
  await pipe(
    NearRepo.initNear(),
    T.delay(3000), // Simulate loading
    TE.chainW(() => NearRepo.getNearProfile()),
    TE.fold(
      err => T.of(nearProfile.update(v => v.setError(err))),
      res => T.of(nearProfile.update(v => v.setValue(res)))
    )
  )()
}

export const login = async () => {
  nearProfile.update(v => v.setLoading())
  await pipe(
    NearRepo.login(),
    T.delay(1000), // Simulate loading
    TE.fold(
      err => T.of(nearProfile.update(v => v.setError(err))),
      _ => T.of(nearProfile.update(v => v.setValue(null)))
    )
  )()
}

export const logout = async () => {
  nearProfile.update(v => v.setLoading())
  await pipe(
    TE.fromEither(NearRepo.logout()),
    T.delay(1000), // Simulate loading
    TE.fold(
      err => T.of(nearProfile.update(v => v.setError(err))),
      _ => T.of(nearProfile.update(v => v.reset()))
    )
  )()
}
