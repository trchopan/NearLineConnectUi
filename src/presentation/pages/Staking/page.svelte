<script lang="ts">
  import {login} from '@/application/useNearAuth'
  import {nearProfile} from '@/application/useNearAuth'
  import {
    stakingPoolInfo,
    stakingAccountInfo,
    getStakingPoolInfo,
    getStakingAccountInfo,
  } from '@/application/useNearStaking'
  import {getFungibleAccountBalance} from '@/application/useNearFungible'
  import {dateFmt, dateTimeFmt, thousandComma} from '@/presentation/helpers'
  import BN from 'bn.js'
  import {onMount} from 'svelte'
  import {fly} from 'svelte/transition'
  import Interval from '@/presentation/components/Interval.svelte'
  import StatCard from '@/presentation/components/StatCard.svelte'
  import StakingTab from './StakingTab.svelte'
  import UnstakingTab from './UnstakingTab.svelte'
  import {addSeconds} from 'date-fns'

  enum Tab {
    Unstake = 'Unstake',
    Stake = 'Stake',
  }

  let activeTab: Tab | null = Tab.Stake

  // This is a hack for sync up the transiton between in-out
  const TAB_CHANGE_DURATION = 300
  const changeTab = (tab: Tab) => {
    activeTab = null
    setTimeout(() => {
      activeTab = tab
    }, TAB_CHANGE_DURATION)
  }

  const refreshAction = () => {
    $nearProfile.onHasData(() => getFungibleAccountBalance())
    $nearProfile.onHasData(() => getStakingAccountInfo())
    getStakingPoolInfo()
  }

  onMount(() => {
    refreshAction()
  })

  interface StakingAccountView {
    accountAmountStaked: string
    pendingReward: string
    canClaim: boolean
  }

  let stakingAccountView: StakingAccountView = {
    accountAmountStaked: 'Loading...',
    pendingReward: 'Loading...',
    canClaim: false,
  }

  interface StakingWithdrawView {
    unstaked: string
    unstakedAt: string
    releaseDate: string
  }

  let stakingWithdrawView: StakingWithdrawView = {
    unstaked: 'Loading...',
    unstakedAt: 'Loading...',
    releaseDate: 'Loading...',
  }

  $: $stakingAccountInfo
    .onHasData(data => {
      //
      stakingAccountView.accountAmountStaked =
        thousandComma(data.stakeBalance.getOrElse(new BN('0')).toString()) +
        ' LINE'
      stakingAccountView.pendingReward =
        thousandComma(data.reward.getOrElse(new BN('0')).toString()) + ' LINE'
      stakingAccountView.canClaim =
        data.canWithdraw &&
        data.unstakeBalance.getOrElse(new BN('0')).gt(new BN('0'))

      //
      stakingWithdrawView.unstaked =
        thousandComma(data.unstakeBalance.getOrElse(new BN('0')).toString()) +
        ' LINE'
      const _unstakedAt = data.unstakeStartTimestamp.getOrElse(new Date(0))
      stakingWithdrawView.unstakedAt = dateTimeFmt(_unstakedAt)
      stakingWithdrawView.releaseDate = dateFmt(addSeconds(_unstakedAt, 43200))
    })
    .onHasError(err => {
      // TODO Handle error
      stakingAccountView.accountAmountStaked = '0 LINE'
      stakingAccountView.pendingReward = '0 LINE'
      stakingAccountView.canClaim = false
    })

  interface StakingStatView {
    isPoolActive: string
    uniqueStakers: string
    totalStaked: string
    totalRewardEarned: string
  }

  let stakingStatView: StakingStatView = {
    isPoolActive: 'Loading...',
    uniqueStakers: 'Loading...',
    totalStaked: 'Loading...',
    totalRewardEarned: 'Loading...',
  }

  $: $stakingPoolInfo.onHasData(data => {
    stakingStatView.isPoolActive = data.isPaused ? 'Inactive' : 'Active'
    stakingStatView.uniqueStakers = thousandComma(
      data.totalStakers.getOrElse(new BN('0')).toString()
    )
    stakingStatView.totalStaked =
      thousandComma(data.totalStakeBalance.getOrElse(new BN('0')).toString()) +
      ' LINE'
    stakingStatView.totalRewardEarned =
      thousandComma(data.totalReward.getOrElse(new BN('0')).toString()) +
      ' LINE'
  })
</script>

<div class="flex items-center place-content-between">
  <h1 class="font-medium text-3xl">Staking</h1>
  <Interval
    duration={15_000}
    on:action={() => refreshAction()}
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
  {#if $nearProfile.loading}
    <div>Loading wallet...</div>
  {:else if $nearProfile.notInited || $nearProfile.hasError}
    <button on:click={login} class="btn btn-black">
      Login NEAR to stake your token
    </button>
  {:else if $nearProfile.hasData}
    <StatCard
      titleAndValues={[
        {
          title: 'Amount staked',
          value: stakingAccountView.accountAmountStaked,
        },
        {
          title: 'Pending Reward',
          value: stakingAccountView.pendingReward,
        },
      ]}
    >
      <div>
        <p class="my-1">
          You can claim reward when reward balance greater than 1 LINE
        </p>
        <button
          class="btn btn-secondary w-full"
          class:btn-disabled={!stakingAccountView.canClaim}
          disabled={!stakingAccountView.canClaim}
        >
          Claim
        </button>
      </div>
    </StatCard>
    <div class="card shadow">
      <div class="card-body">
        <div class="tabs tabs-boxed grid grid-cols-2">
          {#each [Tab.Stake, Tab.Unstake] as tab}
            <span
              on:click={() => changeTab(tab)}
              class:tab-active={activeTab === tab}
              class="tab tab-lg"
            >
              {tab}
            </span>
          {/each}
        </div>
        {#if activeTab === Tab.Stake}
          <div
            out:fly|local={{x: -300, duration: TAB_CHANGE_DURATION}}
            in:fly|local={{x: 300, duration: TAB_CHANGE_DURATION}}
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
    <StatCard
      titleAndValues={[
        {
          title: 'Withdraw',
          value: stakingWithdrawView.unstaked,
        },
      ]}
    >
      <div>
        <p class="my-1">Unstaked at {stakingWithdrawView.unstakedAt}</p>
        <p class="my-1">
          Release date (expected) {stakingWithdrawView.releaseDate}
        </p>
        <p class="my-1">You can withdraw unstaked token now.</p>
        <button
          class="btn btn-secondary w-full"
          class:btn-disabled={!stakingAccountView.canClaim}
          disabled={!stakingAccountView.canClaim}
        >
          Widthdraw
        </button>
      </div>
    </StatCard>
  {/if}
</div>

<div
  class="stats stats-vertical sm:stats-horizontal shadow sm:grid sm:grid-cols-2 my-5 w-full"
>
  <div class="stat">
    <div class="stat-title">Staking Pool Status</div>
    <div class="stat-value text-primary">{stakingStatView.isPoolActive}</div>
  </div>

  <div class="stat">
    <div class="stat-title">Unique Stakers</div>
    <div class="stat-value text-secondary">{stakingStatView.uniqueStakers}</div>
  </div>
</div>
<div
  class="stats stats-vertical sm:stats-horizontal shadow sm:grid sm:grid-cols-2 my-5 w-full"
>
  <div class="stat">
    <div class="stat-title">Total LINE Staked</div>
    <div class="stat-value text-primary">{stakingStatView.totalStaked}</div>
  </div>

  <div class="stat">
    <div class="stat-title">Total Reward Earned</div>
    <div class="stat-value text-secondary">
      {stakingStatView.totalRewardEarned}
    </div>
  </div>
</div>
