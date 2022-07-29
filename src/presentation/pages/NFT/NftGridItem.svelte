<script lang="ts">
  import type {NftGridView} from './NftGridView'
  import {Link} from 'svelte-navigator'

  export let token: NftGridView
  export let sold: boolean = false
  export let owner: boolean = false
</script>

<li
  class="flex flex-col border-2 border-dashed relative"
  class:border-primary={owner}
>
  <span class="absolute top-0 left-0 text-xs">{token.tokenId}</span>
  {#if sold}
    <span class="absolute top-0 right-0 text-lg text-white px-1 bg-accent">
      SOLD
    </span>
  {:else if owner}
    <span class="absolute top-0 right-0 text-lg text-white px-1 bg-primary">
      OWN
    </span>
  {/if}
  <Link to={'/nft/' + token.tokenId}>
    <img src={token.img} alt="0" />
  </Link>
  <div class="px-2 flex flex-col place-content-between h-full">
    <div>
      <p class="font-medium text-ellipsis overflow-hidden my-title">
        {token.title}
      </p>
    </div>
  </div>
</li>

<style>
  .my-title {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
