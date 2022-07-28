import {
  ConnectError,
  ConnectErrorCode,
  IConnectRepo,
} from '@/domain/connect/IConnectRepo'
import {Signature, SignatureMapper} from '@/domain/connect/Signature'
import type {LineId} from '@/domain/liff/LineId'
import type {NearId} from '@/domain/near/NearId'
import type {AxiosInstance} from 'axios'
import {pipe} from 'fp-ts/lib/function'
import * as TE from 'fp-ts/TaskEither'

export class _ConnectRepo implements IConnectRepo {
  constructor(private api: AxiosInstance) {}

  getRegistrationSignature(info: {
    line_id: LineId
    wallet_id: NearId
    token: string
  }): TE.TaskEither<ConnectError, Signature> {
    return pipe(
      TE.tryCatch(
        async () => {
          const {data} = await this.api.post('/sign_registration', {
            line_id: info.line_id.getOrCrash(),
            wallet_id: info.wallet_id.getOrCrash(),
            token: info.token,
          })
          return data
        },
        err => new ConnectError(ConnectErrorCode.ServerError, err)
      ),
      TE.map(SignatureMapper.toDomain)
    )
  }
}
