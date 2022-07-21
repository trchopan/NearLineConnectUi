<script lang="ts">
  import {Link} from 'svelte-navigator'

  interface NftGridView {
    tokenId: string
    img: string
    title: string
    description: string
    ownerId?: string
  }
  export let tokens: NftGridView[] = []
  export let withOwner: boolean = false
</script>

<ul class="grid grid-cols-2 md:grid-cols-3 gap-3">
  {#each tokens as token}
    <li>
      <Link to={'/nft/' + token.tokenId}>
        <img src={token.img} alt="0" />
      </Link>
      <p class="font-medium">{token.title}</p>
      <p>{token.description}</p>
      {#if withOwner}
        <p class="text-sm">{token.ownerId}</p>
      {/if}
    </li>
  {/each}
</ul>
