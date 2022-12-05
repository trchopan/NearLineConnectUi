import {ConnectRepo, LiffRepo, NearRepo} from '@/application/inject'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {pipe} from 'fp-ts/function'
import {get, writable} from 'svelte/store'
import {foldResult, Result} from '@/application/result'
import type {NearError} from '@/domain/near/INearRepo'
import type {LineId} from '@/domain/liff/LineId'
import type {NearId} from '@/domain/near/NearId'
import type {ConnectError} from '@/domain/connect/IConnectRepo'
import type {LiffError} from '@/domain/liff/ILiffRepo'
import type {Signature} from '@/domain/connect/Signature'
import {nearProfile} from './useNearAuth'
import type {LineProfile} from '@/domain/connect/LineProfile'

export const registrationSignature = writable(
  new Result<Signature, ConnectError | LiffError>()
)

export const getRegistrationSignature = async (info: {
  line_id: LineId
  wallet_id: NearId
}) => {
  registrationSignature.update(v => v.setLoading())
  await pipe(
    TE.fromEither(LiffRepo.getLiffAccessToken()),
    TE.chainW(v =>
      ConnectRepo.getRegistrationSignature({
        ...info,
        token: v.token,
      })
    ),
    T.delay(3000), // Simulate loading
    foldResult(registrationSignature)
  )()
}

export const recordLineId = writable(new Result<void, NearError>())

export const signRecordLineId = async ({
  signature,
  line_id,
  wallet,
  expire,
}: {
  signature: string
  line_id: LineId
  wallet: NearId
  expire: number
}) => {
  recordLineId.update(v => v.setLoading())
  await pipe(
    NearRepo.recordLineId(signature, line_id, wallet, expire),
    T.delay(3000), // Simulate loading
    foldResult(recordLineId)
  )()
}

export const removeLineId = writable(new Result<void, NearError>())

export const signRemoveLineId = async ({
  signature,
  line_id,
  wallet,
  expire,
}: {
  signature: string
  line_id: LineId
  wallet: NearId
  expire: number
}) => {
  removeLineId.update(v => v.setLoading())
  await pipe(
    NearRepo.removeLineId(signature, line_id, wallet, expire),
    T.delay(3000), // Simulate loading
    foldResult(removeLineId)
  )()
}

export const myLineIdByWallet = writable(new Result<LineId, NearError>())

export const getMyLineIdByWallet = async () => {
  const _nearProfile = get(nearProfile)
  const _myLineIdByWallet = get(myLineIdByWallet)
  if (
    !_nearProfile.hasData ||
    _nearProfile.value?.accountId.isLeft ||
    _myLineIdByWallet.hasData
  ) {
    return
  }
  myLineIdByWallet.update(v => v.setLoading())
  await pipe(
    NearRepo.getLineIdByWallet(_nearProfile.value?.accountId),
    T.delay(3000), // Simulate loading
    foldResult(myLineIdByWallet)
  )()
}

export const lineIdByWallet = writable(new Result<LineId, NearError>())

export const getLineIdByWallet = async (wallet: NearId) => {
  lineIdByWallet.update(v => v.setLoading())
  await pipe(
    NearRepo.getLineIdByWallet(wallet),
    T.delay(3000), // Simulate loading
    foldResult(lineIdByWallet)
  )()
}

export const lineProfileById = writable(new Result<LineProfile, ConnectError>())

export const getLineProfileById = async (lineId: LineId) => {
  lineProfileById.update(v => v.setLoading())
  await pipe(
    ConnectRepo.getLineProfileByLineId(lineId),
    T.delay(3000), // Simulate loading
    foldResult(lineProfileById)
  )()
}
