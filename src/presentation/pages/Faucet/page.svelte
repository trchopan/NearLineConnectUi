<script lang="ts">
  import {Icon} from '@steeze-ui/svelte-icon'
  import {User} from '@steeze-ui/heroicons'
  import Interval from '@/presentation/components/Interval.svelte'
  import StatCard from '@/presentation/components/StatCard.svelte'
  import BigNumberInput from '@/presentation/components/BigNumberInput.svelte'
  import {onMount} from 'svelte'
  import {
    getFaucetInfo,
    faucetInfo,
    faucetSharedBalance,
    getFaucetSharedBalance,
  } from '@/application/useNearFaucet'
  import BN from 'bn.js'

  let token = 1_000

  const thousandComma = (s: string | number) => {
    return String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const refreshAction = () => {
    getFaucetInfo()
    getFaucetSharedBalance()
  }

  onMount(() => {
    refreshAction()
  })

  let faucetView = {
    tokenClaimed: 'Loading...',
    totalBalanceShare: 'Loading...',
    maxSharePerAccount: 'Loading...',
    refeshing: false,
  }

  // const whenNotInitedOrLoading = () => {
  //   faucetView.refeshing = true
  // }

  $: $faucetSharedBalance.onHasData(data => {
    faucetView.tokenClaimed =
      thousandComma(data.balance.getOrElse(new BN('0')).toString()) + ' LINE'
  })

  $: $faucetInfo
    // .onNotInited(whenNotInitedOrLoading)
    // .onLoading(whenNotInitedOrLoading)
    .onHasData(data => {
      faucetView.totalBalanceShare =
        thousandComma(
          data.totalBalanceShare.getOrElse(new BN('0')).toString()
        ) + ' LINE'

      faucetView.maxSharePerAccount =
        thousandComma(
          data.maxSharePerAccount.getOrElse(new BN('0')).toString()
        ) + ' LINE'
    })
    .onHasError(err => {
      faucetView.refeshing = false
    })
</script>

<div class="flex items-center place-content-between">
  <h1 class="font-medium text-3xl">Faucet</h1>
  <Interval
    duration={15_000}
    on:action={() => refreshAction()}
    tooltip="Refresh Contract information"
  />
</div>

<div class="mt-5 flex flex-col gap-5">
  <StatCard
    on:click={() => console.log('>>>', $faucetInfo)}
    titleAndValues={[
      {
        title: 'Faucet Ballance',
        value: faucetView.totalBalanceShare,
      },
    ]}
    primary
  />

  <StatCard
    on:click={() => console.log('>>>', $faucetSharedBalance)}
    titleAndValues={[
      {
        title: 'Allow token to claim',
        value: faucetView.tokenClaimed,
      },
    ]}
  >
    <div class="form-control w-full">
      <div class="sm:flex gap-3 items-center">
        <BigNumberInput bind:value={token} />
      </div>
    </div>
    <div>
      <p class="my-1">
        One account can get max {faucetView.maxSharePerAccount}. You cannot get more!
      </p>
      <button class="btn btn-secondary w-full">Claim</button>
    </div>
  </StatCard>
</div>

<div
  class="stats stats-vertical sm:stats-horizontal shadow sm:grid sm:grid-cols-2 my-5 w-full"
>
  <div class="stat">
    <div class="stat-figure text-primary">
      <Icon src={User} theme="solid" class="h-7 w-7 color-gray-500" />
    </div>
    <div class="stat-title">Unique Accounts</div>
    <div class="stat-value text-primary">5</div>
  </div>

  <div class="stat">
    <div class="stat-figure text-secondary">LINE</div>
    <div class="stat-title">Total Claimed</div>
    <div class="stat-value text-secondary">2.6M</div>
  </div>
</div>
