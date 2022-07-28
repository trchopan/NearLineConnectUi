<script lang="ts">
  import {
    getLineIdByWallet,
    getLineProfileById,
    lineIdByWallet,
    lineProfileById,
  } from '@/application/useNearLineConnect'
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

  onMount(async () => {
    lineIdByWallet.update(v => v.reset())
    lineProfileById.update(v => v.reset())
    await getSingleNonFungibleTokensInfo(id)
    $singleNonfungibleTokenInfo.onHasData(async wallet => {
      await getLineIdByWallet(wallet.ownerId)
      $lineIdByWallet.onHasData(async lineId => {
        if (lineId.isLeft) return
        await getLineProfileById(lineId)
      })
    })
  })

  const truncateLineId = (str: string) =>
    str.slice(0, 5) + '...' + str.slice(-5)
</script>

<h1 class="text-3xl font-bold my-3">NFT</h1>
{#if $singleNonfungibleTokenInfo.loading}
  <div>Loading...</div>
{:else}
  <div>
    <h1 class="text-3xl font-bold my-3">{singleNonfungibleTokenView.title}</h1>
    <div class="flex justify-center my-3">
      <img
        src={singleNonfungibleTokenView.img}
        alt="0"
        class="max-w-sm w-full h-auto"
      />
    </div>
    <div>
      <span class="bg-accent text-sm px-2">Wallet:</span>
      {singleNonfungibleTokenView.ownerId}
    </div>
    <div>
      <span class="bg-primary text-sm px-2">Description:</span>
      {singleNonfungibleTokenView.description}
    </div>
  </div>

  <div>
    <h2 class="text-xl font-bold my-3">Authentic Check</h2>
    {#if $lineIdByWallet.loading}
      <div>Loading owner LineId...</div>
    {:else if $lineProfileById.loading}
      <div>Loading owner Line Profile...</div>
    {:else if $lineIdByWallet.hasData && $lineProfileById.hasData && $lineIdByWallet.value?.isRight}
      <div class="my-3 flex items-center">
        <div class="mr-3">
          <div class="avatar">
            <div
              class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
            >
              <img src={$lineProfileById.value?.picture.getOrCrash()} alt="0" />
            </div>
          </div>
        </div>
        <div>
          <div>
            <span class="font-medium">LineId:</span>
            <span>{truncateLineId($lineIdByWallet.value?.getOrCrash())}</span>
          </div>
          <div class="text-xl font-medium">
            {$lineProfileById.value?.name.getOrCrash()}
          </div>
        </div>
      </div>
    {:else}
      <h3 class="italic">Owner did not register LINE profile for this token</h3>
    {/if}
  </div>

  <div class="my-10 flex flex-col gap-3">
    <button class="btn btn-primary btn-lg">Share to LINE chat</button>
    <button class="btn btn-black text-white btn-lg">
      View on Near explorer
    </button>
  </div>
{/if}
