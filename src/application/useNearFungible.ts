import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import type {FungibleAccountBalance} from '@/domain/near/FungibleAccountBalance'
import type BN from 'bn.js'

export const fungibleAccountBalance = writable(
  new Result<FungibleAccountBalance, NearError>()
)

export const getFungibleAccountBalance= async () => {
  fungibleAccountBalance.update(v => v.setLoading())
  await pipe(
    NearRepo.getFungibleAccountBalance(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(fungibleAccountBalance.update(v => v.setError(err))),
      res => T.of(fungibleAccountBalance.update(v => v.setValue(res)))
    )
  )()
}

export const claimFaucetTokens = writable(new Result<void, NearError>())

export const signClaimFaucetTokens = async (amount: BN) => {
  claimFaucetTokens.update(v => v.setLoading())
  await pipe(
    NearRepo.claimFaucetTokens(amount.toString()),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(claimFaucetTokens.update(v => v.setError(err))),
      res => T.of(claimFaucetTokens.update(v => v.setValue(res)))
    )
  )()
}
