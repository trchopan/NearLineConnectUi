<script lang="ts">
  import NftGrid from './NftGrid.svelte'
  import {myNonfungibleTokenInfo} from '@/application/useNearNonfungible'
  import * as E from 'fp-ts/Either'

  interface NftGridView {
    tokenId: string
    img: string
    title: string
    description: string
  }
  import {parseIpfs} from '@/presentation/helpers'

  let myTokens: NftGridView[]
  $: $myNonfungibleTokenInfo
    .onNotInited(() => {
      myTokens = []
    })
    .onHasData(data => {
      myTokens = data.tokens.map(
        E.fold(
          err => ({
            tokenId: 'corrupted',
            img: '',
            title: 'corrupted',
            description: 'corrupted',
          }),
          t => {
            const meta = t.metadata.getOrCrash()
            return {
              tokenId: t.tokenId,
              img: parseIpfs(meta.media),
              title: meta.title,
              description: meta.description,
            }
          }
        )
      )
    })
</script>

<div>
  <NftGrid tokens={myTokens} />
</div>
