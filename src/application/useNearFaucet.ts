import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import type {FaucetInfo} from '@/domain/near/FaucetInfo'
import type {FaucetSharedBalance} from '@/domain/near/FaucetSharedBalance'

export const faucetInfo = writable(new Result<FaucetInfo, NearError>())
export const faucetSharedBalance = writable(
  new Result<FaucetSharedBalance, NearError>()
)

export const getFaucetInfo = async () => {
  faucetInfo.update(v => v.setLoading())
  await pipe(
    NearRepo.getFaucetInfo(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(faucetInfo.update(v => v.setError(err))),
      res => T.of(faucetInfo.update(v => v.setValue(res)))
    )
  )()
}

export const getFaucetSharedBalance = async () => {
  faucetSharedBalance.update(v => v.setLoading())
  await pipe(
    NearRepo.getFaucetSharedBalance(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(faucetSharedBalance.update(v => v.setError(err))),
      res => T.of(faucetSharedBalance.update(v => v.setValue(res)))
    )
  )()
}
