<script lang="ts">
  import Sample from '@/assets/line_friends_result.json'
  import {signMintNonFungibleToken} from '@/application/useNearNonfungible'
  import {NearId} from '@/domain/near/NearId'
  import {
    NonfungibleInfo,
    NonfungibleInfoMapper,
  } from '@/domain/near/NonfungibleInfo'
  import {NonfungibleMetadata} from '@/domain/near/NonfungibleMetadata'
  import {NonfungibleTokenId} from '@/domain/near/NonfungibleTokenId'

  import SimpleInput from '@/presentation/components/SimpleInput.svelte'

  let token_id = ''
  let receiver_id = 'choptr.testnet'
  let title = ''
  let description = ''
  let media = ''
  let extra = ''

  $: nft = () =>
    new NonfungibleInfo(
      {
        owner_id: new NearId(receiver_id),
        metadata: new NonfungibleMetadata({
          title,
          description,
          media,
          extra,
        }),
      },
      new NonfungibleTokenId(token_id)
    )
  $: nftValid = () => {
    try {
      return NonfungibleInfoMapper.toPersist(nft())
    } catch (err) {
      console.error(err)
      return null
    }
  }

  const mintNft = () => {
    signMintNonFungibleToken(nft())
  }

  let sample: (string | number)[][] = Sample

  const clickSample = (s: (string | number)[]) => {
    token_id = s[0].toString()
    title = s[1].toString()
    media = s[2].toString()
    description = s[4].toString()
    extra = s[3].toString()
  }
</script>

<h1 class="text-3xl font-medium">NFT Mint</h1>

<h2 class="text-medium">Sample</h2>
<ul class="flex overflow-x-scroll">
  {#each sample as s, i}
    <li class="mr-3">
      <button
        on:click|preventDefault={() => clickSample(s)}
        class="btn btn-ghost">{i}</button
      >
      <div class="w-10">
        <img src={s[2].toString()} alt="0" />
      </div>
    </li>
  {/each}
</ul>

<div class="flex flex-col items-center">
  <SimpleInput title="Token ID" bind:value={token_id} />
  <SimpleInput title="Receiver Id" bind:value={receiver_id} disabled />
  <SimpleInput title="Title" bind:value={title} />
  <SimpleInput title="Description" bind:value={description} area />
  <SimpleInput title="Media" bind:value={media} />
  <SimpleInput title="Price (LINE)" bind:value={extra} />
</div>

<div class="my-5">
  <button on:click|preventDefault={() => mintNft()} class="btn w-full">
    Mint
  </button>
</div>

{#if media}
<div class="flex flex-col items-center">
  <div class="w-full max-w-sm rounded">
    <img src={media} alt="0" />
  </div>
  <div class="text-lg font-medium">{title}</div>
  <div>{extra}</div>
</div>
{/if}
