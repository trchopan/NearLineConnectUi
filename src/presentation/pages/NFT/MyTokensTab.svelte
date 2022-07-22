<script lang="ts">
  import NftGrid from './NftGrid.svelte'
  import {myNonfungibleTokenInfo} from '@/application/useNearNonfungible'
  import {parseIpfs} from '@/presentation/helpers'
  import {isEmpty} from 'lodash'

  interface NftGridView {
    tokenId: string
    img: string
    title: string
    description: string
  }

  let myTokens: NftGridView[]
  $: $myNonfungibleTokenInfo
    .onNotInited(() => {
      myTokens = []
    })
    .onHasData(data => {
      myTokens = data.tokens.map(t => {
        const meta = t.metadata.getOrCrash()
        return {
          tokenId: t.tokenId,
          img: parseIpfs(meta.media),
          title: meta.title,
          description: meta.description,
        }
      })
    })
</script>

{#if $myNonfungibleTokenInfo.loading && isEmpty(myTokens)}
  <div>Loading tokens...</div>
{:else}
  <div>
    <NftGrid tokens={myTokens} />
  </div>
{/if}
