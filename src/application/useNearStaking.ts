import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {foldResult, Result} from '@/application/result'
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
    foldResult(stakingAccountInfo),
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
    foldResult(stakingPoolInfo),
  )()
}

export const stakeFungibleToken = writable(new Result<void, NearError>())

export const signStakeFungibleToken = async (amount: BN) => {
  stakeFungibleToken.update(v => v.setLoading())
  await pipe(
    NearRepo.stakeFungibleToken(amount.toString()),
    T.delay(3000), // Simulate loading
    foldResult(stakeFungibleToken),
  )()
}

export const unstakeFromStakingPool = writable(new Result<void, NearError>())

export const signUnstakeFromStakingPool = async (amount: BN) => {
  unstakeFromStakingPool.update(v => v.setLoading())
  await pipe(
    NearRepo.unstakeFromStakingPool(amount.toString()),
    T.delay(3000), // Simulate loading
    foldResult(unstakeFromStakingPool),
  )()
}

export const havestFromStakingPool = writable(new Result<void, NearError>())

export const signHavestFromStakingPool = async () => {
  havestFromStakingPool.update(v => v.setLoading())
  await pipe(
    NearRepo.havestFromStakingPool(),
    T.delay(3000), // Simulate loading
    foldResult(havestFromStakingPool),
  )()
}

export const withdrawFromStakingPool = writable(new Result<void, NearError>())

export const signWithdrawFromStakingPool = async () => {
  withdrawFromStakingPool.update(v => v.setLoading())
  await pipe(
    NearRepo.withdrawFromStakingPool(),
    T.delay(3000), // Simulate loading
    foldResult(withdrawFromStakingPool),
  )()
}
