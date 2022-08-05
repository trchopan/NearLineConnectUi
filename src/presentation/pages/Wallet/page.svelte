<script lang="ts">
  import {nearProfile} from '@/application/useNearAuth'
  import {
    fungibleAccountBalance,
    getFungibleAccountBalance,
    signTransferFungibleTokens,
  } from '@/application/useNearFungible'
  import {onMount} from 'svelte'
  import Interval from '@/presentation/components/Interval.svelte'
  import StatCard from '@/presentation/components/StatCard.svelte'
  import {thousandComma} from '@/presentation/helpers'
  import SimpleInput from '@/presentation/components/SimpleInput.svelte'
  import BigNumberInput from '@/presentation/components/BigNumberInput.svelte'
  import BN from 'bn.js'
  import {NearId} from '@/domain/near/NearId'

  const refreshAction = () => {
    $nearProfile.onHasData(() => getFungibleAccountBalance())
  }

  onMount(() => {
    refreshAction()
  })

  interface WalletView {
    fungibleAccountBalance: string
  }

  let walletView: WalletView = {
    fungibleAccountBalance: 'Loading...',
  }

  $: $fungibleAccountBalance.onHasData(data => {
    walletView.fungibleAccountBalance =
      thousandComma(data.balance.getOrCrash().toString()) + ' LINE'
  })

  let receiver_addr = ''
  $: receiver_id = new NearId(receiver_addr)
  let amount: BN = new BN(0)

  const sendFungibleToken = () => {
    signTransferFungibleTokens(receiver_id, amount)
  }
</script>

<div class="flex items-center place-content-between">
  <h1 class="font-medium text-3xl">Wallet</h1>
  <Interval
    duration={15_000}
    on:action={() => refreshAction()}
    tooltip="Refresh Contract information"
  />
</div>

<div class="my-10">
  <StatCard
    titleAndValues={[
      {
        title: 'Balance',
        value: walletView.fungibleAccountBalance,
      },
    ]}
    primary
  />
  <div class="mt-10 flex flex-col gap-5">
    <SimpleInput title="Receiver Address" bind:value={receiver_addr} />
    <BigNumberInput bind:value={amount} />
  </div>
  <div class="my-5">
    <button
      on:click|preventDefault={() => sendFungibleToken()}
      class="btn w-full"
    >
      Send
    </button>
  </div>
</div>
