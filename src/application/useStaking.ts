import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import type {StakingPoolInfo} from '@/domain/near/StakingPoolInfo'
import type {StakingAccountInfo} from '@/domain/near/StakingAccountInfo'

export const stakingAccountInfo = writable(
  new Result<StakingAccountInfo, NearError>()
)

export const stakingPoolInfo = writable(
  new Result<StakingPoolInfo, NearError>()
)

export const getStakingAccountInfo = async () => {
  stakingAccountInfo.update(v => v.setLoading())
  await pipe(
    NearRepo.getStakingAccountInfo(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(stakingAccountInfo.update(v => v.setError(err))),
      res => T.of(stakingAccountInfo.update(v => v.setValue(res)))
    )
  )()
}

export const getStakingPoolInfo = async () => {
  stakingPoolInfo.update(v => v.setLoading())
  await pipe(
    NearRepo.getStakingPoolInfo(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(stakingPoolInfo.update(v => v.setError(err))),
      res => T.of(stakingPoolInfo.update(v => v.setValue(res)))
    )
  )()
}
