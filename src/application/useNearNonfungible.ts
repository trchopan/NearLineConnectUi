import {NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import {pipe} from 'fp-ts/function'
import {writable} from 'svelte/store'
import {foldResult, Result} from '@/application/result'
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
    foldResult(myNonfungibleTokenInfo),
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
    foldResult(allNonfungibleTokenInfo),
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
    foldResult(singleNonfungibleTokenInfo),
  )()
}

export const mintNonFungibleToken = writable(new Result<void, NearError>())

export const signMintNonFungibleToken = async (t: NonfungibleInfo) => {
  mintNonFungibleToken.update(v => v.setLoading())
  await pipe(
    NearRepo.mintNonFungibleToken(t),
    T.delay(3000), // Simulate loading
    foldResult(mintNonFungibleToken),
  )()
}

export const buyNonFungibleToken = writable(new Result<void, NearError>())

export const signBuyNonfungibleToken = async (token: NonfungibleInfo) => {
  buyNonFungibleToken.update(v => v.setLoading())
  await pipe(
    NearRepo.buyNonFungibleToken(token.tokenId, token.metadata.extra),
    T.delay(3000), // Simulate loading
    foldResult(buyNonFungibleToken),
  )()
}
