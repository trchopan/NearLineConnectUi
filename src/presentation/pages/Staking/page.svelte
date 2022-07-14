<script lang="ts">
  import {fly} from 'svelte/transition'
  import Interval from '../../components/Interval.svelte'
  import StatCard from '../../components/StatCard.svelte'
  import StakingTab from './StakingTab.svelte'
  import UnstakingTab from './UnstakingTab.svelte'

  enum Tab {
    Unstake,
    Stake,
  }

  let token = 1000
  let activeTab: Tab | null = Tab.Stake

  const TAB_CHANGE_DURATION = 300
  const changeTab = (tab: Tab) => {
    activeTab = null
    setTimeout(() => {
      activeTab = tab
    }, TAB_CHANGE_DURATION)
  }
</script>

<div class="flex items-center place-content-between">
  <h1 class="font-medium text-3xl">Staking</h1>
  <Interval
    duration={15_000}
    on:action={() => console.log('nanii Staking')}
    tooltip="Refresh Contract information"
  />
</div>

<div class="mt-10 flex flex-col gap-5">
  <StatCard
    titleAndValues={[
      {
        title: 'Staking APY',
        value: '18%',
      },
    ]}
    primary
  />
  <StatCard
    titleAndValues={[
      {
        title: 'Total staked',
        value: '1,000,000 LINE',
      },
      {
        title: 'Pending Reward',
        value: '456 LINE',
      },
    ]}
  >
    <div>
      <p class="my-1">
        You can claim reward when reward balance greater than 1 LINE
      </p>
      <button class="btn btn-secondary w-full">Claim</button>
    </div>
  </StatCard>

  <div class="card shadow">
    <div class="card-body">
      <div class="tabs tabs-boxed grid grid-cols-2">
        <span
          on:click={() => changeTab(Tab.Stake)}
          class={'tab tab-lg ' + (activeTab === Tab.Stake ? 'tab-active' : '')}
        >
          Stake
        </span>
        <span
          on:click={() => changeTab(Tab.Unstake)}
          class={'tab tab-lg ' +
            (activeTab === Tab.Unstake ? 'tab-active' : '')}
        >
          Unstake
        </span>
      </div>
      {#if activeTab === Tab.Stake}
        <div
          out:fly|local={{x: 300, duration: TAB_CHANGE_DURATION}}
          in:fly|local={{x: -300, duration: TAB_CHANGE_DURATION}}
        >
          <StakingTab />
        </div>
      {/if}
      {#if activeTab === Tab.Unstake}
        <div
          out:fly|local={{x: 300, duration: TAB_CHANGE_DURATION}}
          in:fly|local={{x: -300, duration: TAB_CHANGE_DURATION}}
        >
          <UnstakingTab />
        </div>
      {/if}
    </div>
  </div>
</div>

<div
  class="stats stats-vertical sm:stats-horizontal shadow sm:grid sm:grid-cols-2 my-5 w-full"
>
  <div class="stat">
    <div class="stat-title">Staking Pool Status</div>
    <div class="stat-value text-primary">Active</div>
  </div>

  <div class="stat">
    <div class="stat-title">Unique Stakers</div>
    <div class="stat-value text-secondary">5</div>
  </div>
</div>
<div
  class="stats stats-vertical sm:stats-horizontal shadow sm:grid sm:grid-cols-2 my-5 w-full"
>
  <div class="stat">
    <div class="stat-title">Total LINE Staked</div>
    <div class="stat-value text-primary">5M</div>
  </div>

  <div class="stat">
    <div class="stat-title">Total Reward Earned</div>
    <div class="stat-value text-secondary">2.6M</div>
  </div>
</div>
