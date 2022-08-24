<script lang="ts">
  import NftGridItem from './NftGridItem.svelte'
  import {myNonfungibleTokenInfo} from '@/application/useNearNonfungible'
  import {parseIpfs} from '@/presentation/helpers'
  import {isEmpty} from 'lodash'
  import type {NftGridView} from './NftGridView'

  let myTokens: NftGridView[]
  $: $myNonfungibleTokenInfo
    .onNotInited(() => {
      myTokens = []
    })
    .onHasData(data => {
      myTokens = data.orderedTokens.map(t => {
        const meta = t.metadata
        return {
          ownerId: t.ownerId.getOrCrash(),
          tokenId: t.tokenId.getOrCrash(),
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
  <ul class="grid grid-cols-2 md:grid-cols-3 gap-3">
    {#each myTokens as token}
      <NftGridItem {token} />
    {/each}
  </ul>
{/if}
