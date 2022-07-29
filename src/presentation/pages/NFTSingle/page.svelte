<script lang="ts">
  import LineLogo from '@/assets/LINE_logo.svg'
  import {Link} from 'svelte-navigator'
  import {
    getLineIdByWallet,
    getLineProfileById,
    lineIdByWallet,
    lineProfileById,
  } from '@/application/useNearLineConnect'
  import {
    singleNonfungibleTokenInfo,
    getSingleNonFungibleTokensInfo,
    signBuyNonfungibleToken,
  } from '@/application/useNearNonfungible'
  import {
    copyToClipboard,
    parseIpfs,
    thousandComma,
  } from '@/presentation/helpers'
  import {onMount} from 'svelte'
  import {blur} from 'svelte/transition'
  import type {NonfungibleInfo} from '@/domain/near/NonfungibleInfo'
  import liff from '@line/liff'
  import {doShareTargetPicker} from '@/application/useLiffAuth'

  export let id: string

  interface SingleNonfungibleTokenView {
    token?: NonfungibleInfo
    token_id: string
    img: string
    title: string
    description: string
    ownerId: string
    price: string
  }

  let singleNonfungibleTokenView: SingleNonfungibleTokenView = {
    token_id: 'Loading...',
    img: 'Loading...',
    title: 'Loading...',
    description: 'Loading...',
    ownerId: 'Loading...',
    price: 'Loading...',
  }

  $: $singleNonfungibleTokenInfo.onHasData(data => {
    const meta = data.metadata
    singleNonfungibleTokenView = {
      token: data,
      token_id: data.tokenId.getOrCrash(),
      img: parseIpfs(meta.media),
      title: meta.title,
      description: meta.description,
      ownerId: data.ownerId.getOrCrash(),
      price: thousandComma(meta.extra.toString()),
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

  const viewOnWallet = () => {
    const contract = import.meta.env.VITE_NFT_CONTRACT_NAME
    const id = singleNonfungibleTokenView.token_id
    const url = `https://wallet.testnet.near.org/nft-detail/${contract}/${id}`
    ;(window as Window).open(url)
  }

  let toast = false
  const share = () => {
    const url = document.location.href
    if (liff.getOS() == 'web') {
      copyToClipboard(url)

      if (toast) return
      toast = true
      setTimeout(() => (toast = false), 1000)
      return
    }
    const shareData: ShareData = {
      title: 'Demo View NFT - Near Line Connect',
      url,
      text: singleNonfungibleTokenView.description.slice(0, 200),
    }
    navigator.share(shareData)
  }

  $: canPurchase = () =>
    singleNonfungibleTokenView.ownerId === import.meta.env.VITE_NFT_OWNER_ID
</script>

<Link to="/nft">
  <h1 class="text-3xl font-bold my-3">NFT</h1>
</Link>
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
    <div class="flex place-content-between">
      <div class="text-lg font-medium">
        ID: {singleNonfungibleTokenView.token_id}
      </div>
      <div class="text-lg font-medium">
        {singleNonfungibleTokenView.price}
        <span class="text-secondary mx-1">LINE</span>
      </div>
    </div>
    {#if !canPurchase()}
      <div>
        <span class="bg-accent text-sm px-2">Wallet:</span>
        {singleNonfungibleTokenView.ownerId}
      </div>
    {/if}
    <div>
      <div>
        <span class="bg-primary text-sm px-2">Description:</span>
      </div>
      <div>
        {singleNonfungibleTokenView.description}
      </div>
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
    {#if canPurchase()}
      <button
        on:click|preventDefault={() =>
          signBuyNonfungibleToken(singleNonfungibleTokenView.token)}
        class="btn btn-primary btn-lg text-white"
      >
        Purchase with LINE token
      </button>
    {/if}
    <button
      on:click|preventDefault={() => share()}
      class="btn btn-secondary btn-lg"
    >
      <img src={LineLogo} alt="0" class="w-5 h-5 mr-3" />
      Share to LINE Chat
    </button>
    <button
      on:click|preventDefault={() => viewOnWallet()}
      class="btn btn-black text-white btn-lg"
    >
      View on Near Explorer
    </button>
  </div>
{/if}

{#if toast}
  <div transition:blur={{duration: 150}} class="toast toast-center">
    <div class="alert alert-info">
      <div>
        <span>Copied share link to clipboard</span>
      </div>
    </div>
  </div>
{/if}
