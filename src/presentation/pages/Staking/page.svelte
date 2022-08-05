<script lang="ts">
  import {login} from '@/application/useNearAuth'
  import {nearProfile} from '@/application/useNearAuth'
  import {
    stakingPoolInfo,
    stakingAccountInfo,
    getStakingPoolInfo,
    getStakingAccountInfo,
    signHavestFromStakingPool,
    signWithdrawFromStakingPool,
    havestFromStakingPool,
    withdrawFromStakingPool,
  } from '@/application/useNearStaking'
  import {getFungibleAccountBalance} from '@/application/useNearFungible'
  import {dateFmt, dateTimeFmt, thousandComma} from '@/presentation/helpers'
  import BN from 'bn.js'
  import {onMount} from 'svelte'
  import Interval from '@/presentation/components/Interval.svelte'
  import StatCard from '@/presentation/components/StatCard.svelte'
  import StakingTab from './StakingTab.svelte'
  import UnstakingTab from './UnstakingTab.svelte'
  import {addSeconds} from 'date-fns'
  import TabCards from '@/presentation/components/TabCards.svelte'

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
        thousandComma(data.stakeBalance.getOrElse(new BN(0)).toString()) +
        ' LINE'
      stakingAccountView.pendingReward =
        thousandComma(data.reward.getOrElse(new BN(0)).toString()) + ' LINE'
      stakingAccountView.canClaim = data.reward.getOrElse(new BN(0)).gt(new BN(0))

      //
      stakingWithdrawView.unstaked =
        thousandComma(data.unstakeBalance.getOrElse(new BN(0)).toString()) +
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
      data.totalStakers.getOrElse(new BN(0)).toString()
    )
    stakingStatView.totalStaked =
      thousandComma(data.totalStakeBalance.getOrElse(new BN(0)).toString()) +
      ' LINE'
    stakingStatView.totalRewardEarned =
      thousandComma(data.totalReward.getOrElse(new BN(0)).toString()) + ' LINE'
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
          on:click={() => signHavestFromStakingPool()}
          class="btn btn-secondary w-full"
          class:btn-disabled={!stakingAccountView.canClaim}
          class:loading={$havestFromStakingPool.loading}
        >
          Claim
        </button>
      </div>
    </StatCard>

    <TabCards
      config={[
        {name: 'Stake', component: StakingTab},
        {name: 'Unstake', component: UnstakingTab},
      ]}
    />

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
          on:click={() => signWithdrawFromStakingPool()}
          class="btn btn-secondary w-full"
          class:loading={$withdrawFromStakingPool.loading}
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
