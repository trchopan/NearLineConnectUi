<script lang="ts">
  import {
    singleNonfungibleTokenInfo,
    getSingleNonFungibleTokensInfo,
  } from '@/application/useNearNonfungible'
  import {parseIpfs} from '@/presentation/helpers'
  import {onMount} from 'svelte'

  export let id: string

  interface SingleNonfungibleTokenView {
    img: string
    title: string
    description: string
    ownerId: string
  }

  let singleNonfungibleTokenView: SingleNonfungibleTokenView = {
    img: 'Loading...',
    title: 'Loading...',
    description: 'Loading...',
    ownerId: 'Loading...',
  }

  $: $singleNonfungibleTokenInfo.onHasData(data => {
    const meta = data.metadata.getOrCrash()
    singleNonfungibleTokenView = {
      img: parseIpfs(meta.media),
      title: meta.title,
      description: meta.description,
      ownerId: data.ownerId.getOrCrash(),
    }
  })

  onMount(() => {
    getSingleNonFungibleTokensInfo(id)
  })
</script>

<h1 class="text-3xl font-bold my-3">NFT</h1>
{#if $singleNonfungibleTokenInfo.loading}
  <div>Loading...</div>
{:else}
  <div>
    <h1 class="text-3xl font-bold my-3">{singleNonfungibleTokenView.title}</h1>
    <div class="flex justify-center my-3">
      <img src={singleNonfungibleTokenView.img} alt="0" class="max-w-sm w-full h-auto" />
    </div>
    <div>
      <span class="bg-accent text-sm px-1">Owner:</span>
      {singleNonfungibleTokenView.ownerId}
    </div>
    <div>
      <span class="bg-primary text-sm px-1">Description:</span>
      {singleNonfungibleTokenView.description}
    </div>
  </div>

  <div class="my-10 flex flex-col gap-3">
    <button class="btn btn-primary btn-lg">Share to LINE chat</button>
    <button class="btn btn-black text-white btn-lg">
      View on Near explorer
    </button>
  </div>
{/if}
