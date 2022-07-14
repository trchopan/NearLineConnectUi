import liff from '@line/liff'
import {_LiffRepo, _LiffRepoFailure} from '@/infrastructure/LiffRepo'
import type {ILiffRepo} from '@/domain/liff/ILiffRepo'

export const LiffRepo: ILiffRepo = new _LiffRepo(liff)
// export const LiffRepo: ILiffRepo = new _LiffRepoFailure(liff)
