import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import type {StakingPoolInfo} from '@/domain/near/StakingPoolInfo'
import type {StakingAccountInfo} from '@/domain/near/StakingAccountInfo'
import type BN from 'bn.js'

export const stakingAccountInfo = writable(
  new Result<StakingAccountInfo, NearError>()
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

export const stakingPoolInfo = writable(
  new Result<StakingPoolInfo, NearError>()
)

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

export const stakeFungibleToken = writable(new Result<void, NearError>())

export const signStakeFungibleToken = async (amount: BN) => {
  stakeFungibleToken.update(v => v.setLoading())
  await pipe(
    NearRepo.stakeFungibleToken(amount.toString()),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(stakeFungibleToken.update(v => v.setError(err))),
      res => T.of(stakeFungibleToken.update(v => v.setValue(res)))
    )
  )()
}

export const unstakeFromStakingPool = writable(new Result<void, NearError>())

export const signUnstakeFromStakingPool = async (amount: BN) => {
  unstakeFromStakingPool.update(v => v.setLoading())
  await pipe(
    NearRepo.unstakeFromStakingPool(amount.toString()),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(unstakeFromStakingPool.update(v => v.setError(err))),
      res => T.of(unstakeFromStakingPool.update(v => v.setValue(res)))
    )
  )()
}
