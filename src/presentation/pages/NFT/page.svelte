<script lang="ts">
  import Interval from '@/presentation/components/Interval.svelte'
  import {onMount} from 'svelte'
  import {
    myNonfungibleTokenInfo,
    allNonfungibleTokenInfo,
    getMyNonFungibleTokensInfo,
    getAllNonFungibleTokensInfo,
  } from '@/application/useNearNonfungible'
  import {nearProfile} from '@/application/useNearAuth'
  import TabCards from '@/presentation/components/TabCards.svelte'
  import AllTokensTab from './AllTokensTab.svelte'
  import MyTokensTab from './MyTokensTab.svelte'

  const refreshAction = () => {
    $nearProfile.onHasData(() => getMyNonFungibleTokensInfo())
    getAllNonFungibleTokensInfo()
  }

  onMount(() => {
    refreshAction()
  })
</script>

<div class="flex items-center place-content-between">
  <h1 class="font-medium text-3xl mb-3">NFT</h1>
  <Interval
    duration={15_000}
    on:action={() => refreshAction()}
    tooltip="Refresh Contract information"
  />
</div>

<div class="mb-20">
  {#if $nearProfile.loading}
    <div>Loading wallet...</div>
  {:else if $nearProfile.notInited || $nearProfile.hasError}
    <AllTokensTab />
  {:else if !$myNonfungibleTokenInfo.hasError && !$allNonfungibleTokenInfo.hasError}
    <TabCards
      config={[
        {name: 'All tokens', component: AllTokensTab},
        {name: 'My tokens', component: MyTokensTab},
      ]}
    />
  {/if}
</div>
