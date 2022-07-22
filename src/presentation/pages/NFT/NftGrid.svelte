<script lang="ts">
  import {nearProfile} from '@/application/useNearAuth'

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
  const isMyToken = (ownerId: string) =>
    ownerId === $nearProfile.value?.accountId.getOrElse(null)
</script>

<ul class="grid grid-cols-2 md:grid-cols-3 gap-3">
  {#each tokens as token}
    <li
      class={`h-64 flex flex-col border-2 border-dashed ${
        withOwner && isMyToken(token.ownerId) ? 'border-primary' : ''
      }`}
    >
      <Link to={'/nft/' + token.tokenId}>
        <img src={token.img} alt="0" />
      </Link>
      <div class="px-2 flex flex-col place-content-between h-full">
        <div>
          <p class="font-medium">{token.title}</p>
          <p>{token.description}</p>
        </div>
        {#if withOwner}
          <div
            class={`truncate text-sm px-1 ${
              isMyToken(token.ownerId)
                ? 'bg-primary text-medium'
                : 'bg-gray-200'
            }`}
          >
            {token.ownerId}
          </div>
        {/if}
      </div>
    </li>
  {/each}
</ul>
