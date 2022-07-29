<script lang="ts">
  import NftGridItem from './NftGridItem.svelte'
  import {allNonfungibleTokenInfo} from '@/application/useNearNonfungible'
  import {login, nearProfile} from '@/application/useNearAuth'
  import {parseIpfs} from '@/presentation/helpers'
  import {isEmpty} from 'lodash'
  import type {NftGridView} from './NftGridView'

  let allTokens: NftGridView[] = []
  $: $allNonfungibleTokenInfo.onHasData(data => {
    allTokens = data.tokens.map(t => {
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

  const isCreator = (token: NftGridView) =>
    token.ownerId === import.meta.env.VITE_NFT_OWNER_ID

  const isMyToken = (token: NftGridView) =>
    token.ownerId === $nearProfile.value?.accountId.getOrElse(null)
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
  <ul class="grid grid-cols-2 md:grid-cols-3 gap-3">
    {#each allTokens as token}
      <NftGridItem
        {token}
        sold={!isCreator(token) && !isMyToken(token)}
        owner={!isCreator(token) && isMyToken(token)}
      />
    {/each}
  </ul>
{/if}
