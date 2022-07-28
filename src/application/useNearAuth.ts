import type {NearProfile} from '@/domain/near/NearProfile'
import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import {getStakingAccountInfo, stakingAccountInfo} from './useNearStaking'
import {
  fungibleAccountBalance,
  getFungibleAccountBalance,
} from './useNearFungible'
import {
  getMyNonFungibleTokensInfo,
  myNonfungibleTokenInfo,
} from './useNearNonfungible'
import {myLineIdByWallet} from './useNearLineConnect'

export const nearProfile = writable(new Result<NearProfile, NearError>())

export const authCheck = async () => {
  nearProfile.update(v => v.setLoading())
  await pipe(
    NearRepo.getNearProfile(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(nearProfile.update(v => v.setError(err))),
      res => {
        getStakingAccountInfo()
        getFungibleAccountBalance()
        getMyNonFungibleTokensInfo()
        return T.of(nearProfile.update(v => v.setValue(res)))
      }
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
      _ => {
        myLineIdByWallet.update(v => v.reset())
        stakingAccountInfo.update(v => v.reset())
        fungibleAccountBalance.update(v => v.reset())
        myNonfungibleTokenInfo.update(v => v.reset())
        return T.of(nearProfile.update(v => v.reset()))
      }
    )
  )()
}
