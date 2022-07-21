<script lang="ts">
  import NftGrid from './NftGrid.svelte'
  import * as E from 'fp-ts/Either'
  import {allNonfungibleTokenInfo} from '@/application/useNearNonfungible'
  import {login, nearProfile} from '@/application/useNearAuth'
  import {parseIpfs} from '@/presentation/helpers'

  interface NftGridView {
    tokenId: string
    ownerId: string
    img: string
    title: string
    description: string
  }

  let allTokens: NftGridView[]
  $: $allNonfungibleTokenInfo
    .onNotInited(() => {
      allTokens = []
    })
    .onHasData(data => {
      allTokens = data.tokens.map(
        E.fold(
          err => ({
            tokenId: 'corrupted',
            ownerId: 'corrupted',
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
              ownerId: t.ownerId.getOrCrash(),
            }
          }
        )
      )
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
<div>
  <h1 class="text-2xl font-medium mb-5">Collection Test Squid Game</h1>
  <NftGrid tokens={allTokens} withOwner />
</div>
