<script lang="ts">
  import {Icon} from '@steeze-ui/svelte-icon'
  import {User} from '@steeze-ui/heroicons'
  import {thousandComma} from '@/presentation/helpers'
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
  import {
    claimFaucetTokens,
    signClaimFaucetTokens,
  } from '@/application/useNearFungible'
  import ErrorModal from '@/presentation/components/ErrorModal.svelte'
  import type {NearError} from '@/domain/near/INearRepo'

  let token = new BN('1000')

  const refreshAction = () => {
    getFaucetInfo()
    getFaucetSharedBalance()
  }

  onMount(() => {
    refreshAction()
  })

  interface FaucetView {
    faucetBalance: string
    maxSharePerAccount: string
    uniqueAccounts: string
    tokenClaimed: string
    totalClaimed: string
    claimErrorModal: boolean
    claimError: null | NearError
  }

  let faucetView: FaucetView = {
    faucetBalance: 'Loading...',
    maxSharePerAccount: 'Loading...',
    uniqueAccounts: 'Loading...',
    tokenClaimed: 'Loading...',
    totalClaimed: 'Loading...',
    claimErrorModal: false,
    claimError: null,
  }

  $: $faucetSharedBalance.onHasData(data => {
    faucetView.tokenClaimed =
      thousandComma(data.balance.getOrElse(new BN('0')).toString()) + ' LINE'
  })

  $: $faucetInfo.onHasData(data => {
    faucetView.faucetBalance = thousandComma(
      data.totalBalanceShare.getOrElse(new BN('0')).toString() + ' LINE'
    )

    faucetView.maxSharePerAccount = thousandComma(
      data.maxSharePerAccount.getOrElse(new BN('0')).toString()
    )

    faucetView.uniqueAccounts = thousandComma(
      data.totalAccountShared.getOrElse(new BN('0')).toString()
    )

    faucetView.totalClaimed = thousandComma(
      data.totalShared.getOrElse(new BN('0')).toString()
    )
  })

  $: $claimFaucetTokens.onHasError(err => {
    faucetView.claimErrorModal = true
    faucetView.claimError = err
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
    titleAndValues={[
      {
        title: 'Faucet Ballance',
        value: faucetView.faucetBalance,
      },
    ]}
    primary
  />

  <StatCard
    titleAndValues={[
      {
        title: 'Token claimed',
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
      {#if faucetView.maxSharePerAccount === 'Loading...'}
        <p class="my-1">Loading...</p>
      {:else}
        <p class="my-1">
          One account can get max {faucetView.maxSharePerAccount} LINE. You cannot
          get more!
        </p>
      {/if}
      <button
        on:click|preventDefault={() => signClaimFaucetTokens(token)}
        class="btn btn-secondary w-full"
        class:loading={$claimFaucetTokens.loading}
        class:btn-disabled={$claimFaucetTokens.loading}
      >
        Claim
      </button>
    </div>
  </StatCard>
</div>

<div
  class="stats stats-vertical sm:stats-horizontal shadow sm:grid sm:grid-cols-2 my-5 w-full"
>
  <div class="stat">
    <div class="stat-title">Unique Accounts</div>
    <div class="stat-value text-primary">{faucetView.uniqueAccounts}</div>
    <div class="stat-figure text-primary">
      <Icon src={User} theme="solid" class="h-7 w-7 color-gray-500" />
    </div>
  </div>

  <div class="stat">
    <div class="stat-title">Total Claimed</div>
    <div class="stat-value text-secondary">{faucetView.totalClaimed}</div>
    <div class="stat-figure text-secondary">LINE</div>
  </div>
</div>

<ErrorModal
  open={faucetView.claimErrorModal}
  on:close={() => (faucetView.claimErrorModal = false)}
>
  Call `Claim token` to smart contract has Error. Please check that you has
  login your NEAR wallet.
</ErrorModal>
