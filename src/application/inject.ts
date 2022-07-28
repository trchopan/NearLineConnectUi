import liff from '@line/liff'
import {_LiffRepo} from '@/infrastructure/LiffRepo'
import type {ILiffRepo} from '@/domain/liff/ILiffRepo'
import type {INearRepo} from '@/domain/near/INearRepo'
import {
  getConfig,
  nearBrowserLocalStorage,
  _NearRepo,
} from '@/infrastructure/NearRepo'
import type {IConnectRepo} from '@/domain/connect/IConnectRepo'
import {_ConnectRepo} from '@/infrastructure/ConnectRepo'
import axios from 'axios'

export const LiffRepo: ILiffRepo = new _LiffRepo(liff)
export const NearRepo: INearRepo = new _NearRepo(
  nearBrowserLocalStorage(getConfig(import.meta.env.MODE)),
  {
    staking: import.meta.env.VITE_STAKING_CONTRACT_NAME,
    faucet: import.meta.env.VITE_FAUCET_CONTRACT_NAME,
    fungible: import.meta.env.VITE_FT_CONTRACT_NAME,
    nonfungible: import.meta.env.VITE_NFT_CONTRACT_NAME,
    nearLineConnect: import.meta.env.VITE_NEAR_LINE_CONNECT_CONTRACT_NAME,
  }
)
export const ConnectRepo: IConnectRepo = new _ConnectRepo(
  axios.create({
    baseURL: import.meta.env.VITE_CONNECT_ENDPOINT,
  })
)
