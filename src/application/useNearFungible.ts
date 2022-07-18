import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'

export const claimFaucetTokens = writable(new Result<void, NearError>())

export const signClaimFaucetTokens = async (amount: string) => {
  claimFaucetTokens.update(v => v.setLoading())
  await pipe(
    NearRepo.claimFaucetTokens(amount),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(claimFaucetTokens.update(v => v.setError(err))),
      res => T.of(claimFaucetTokens.update(v => v.setValue(res)))
    )
  )()
}
