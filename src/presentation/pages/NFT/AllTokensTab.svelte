<script lang="ts">
  import NftGrid from './NftGrid.svelte'
  import {allNonfungibleTokenInfo} from '@/application/useNearNonfungible'
  import {login, nearProfile} from '@/application/useNearAuth'
  import {parseIpfs} from '@/presentation/helpers'
  import {isEmpty} from 'lodash'

  interface NftGridView {
    tokenId: string
    ownerId: string
    img: string
    title: string
    description: string
  }

  let allTokens: NftGridView[] = []
  $: $allNonfungibleTokenInfo.onHasData(data => {
    allTokens = data.tokens.map(t => {
      const meta = t.metadata.getOrCrash()
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

{#if $nearProfile.notInited || $nearProfile.hasError}
  <div>
    <p>
      To enjoy NFT awesomeness please login. You can participate in the lucky
      draw to own some of the NFT in the collection.
    </p>
    <div class="my-5">
      <button on:click={login} class="btn btn-black w-full">
        Login NEAR to lucky draw your NFTs
      </button>
    </div>
  </div>
{/if}
{#if $allNonfungibleTokenInfo.loading && isEmpty(allTokens)}
  <div>Loading tokens...</div>
{:else}
  <div>
    <NftGrid tokens={allTokens} withOwner />
  </div>
{/if}
