import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import type {NonfungibleInfoList} from '@/domain/near/NonfungibleInfoList'
import type {NonfungibleInfo} from '@/domain/near/NonfungibleInfo'

export const myNonfungibleTokenInfo = writable(
  new Result<NonfungibleInfoList, NearError>()
)

export const getMyNonFungibleTokensInfo = async () => {
  myNonfungibleTokenInfo.update(v => v.setLoading())
  await pipe(
    NearRepo.getMyNonFungibleTokensInfo(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(myNonfungibleTokenInfo.update(v => v.setError(err))),
      res => T.of(myNonfungibleTokenInfo.update(v => v.setValue(res)))
    )
  )()
}

export const allNonfungibleTokenInfo = writable(
  new Result<NonfungibleInfoList, NearError>()
)

export const getAllNonFungibleTokensInfo = async () => {
  allNonfungibleTokenInfo.update(v => v.setLoading())
  await pipe(
    NearRepo.getAllNonFungibleTokensInfo(),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(allNonfungibleTokenInfo.update(v => v.setError(err))),
      res => T.of(allNonfungibleTokenInfo.update(v => v.setValue(res)))
    )
  )()
}

export const singleNonfungibleTokenInfo = writable(
  new Result<NonfungibleInfo, NearError>()
)

export const getSingleNonFungibleTokensInfo = async (tokenId: string) => {
  singleNonfungibleTokenInfo.update(v => v.setLoading())
  await pipe(
    NearRepo.getSingleNonFungibleTokensInfo(tokenId),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(singleNonfungibleTokenInfo.update(v => v.setError(err))),
      res => T.of(singleNonfungibleTokenInfo.update(v => v.setValue(res)))
    )
  )()
}

export const mintNonFungibleToken = writable(new Result<void, NearError>())

export const signMintNonFungibleToken = async (t: NonfungibleInfo) => {
  mintNonFungibleToken.update(v => v.setLoading())
  await pipe(
    NearRepo.mintNonFungibleToken(t),
    T.delay(3000), // Simulate loading
    TE.fold(
      err => T.of(mintNonFungibleToken.update(v => v.setError(err))),
      res => T.of(mintNonFungibleToken.update(v => v.setValue(res)))
    )
  )()
}
