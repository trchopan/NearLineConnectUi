<script lang="ts">
  import {fungibleAccountBalance} from '@/application/useNearFungible'
  import {thousandComma} from '@/presentation/helpers'
  import BigNumberInput from '@/presentation/components/BigNumberInput.svelte'
  import BN from 'bn.js'
  import {
    stakeFungibleToken,
    signStakeFungibleToken,
  } from '@/application/useNearStaking'

  let token: BN | undefined = undefined

  interface StakeTabView {
    accountBalanceText: string
    accountBalanceNumber: BN
  }

  let stakeTabView: StakeTabView = {
    accountBalanceText: 'Loading...',
    accountBalanceNumber: new BN(0),
  }

  $: $fungibleAccountBalance.onHasData(data => {
    const _balance = data.balance.getOrElse(new BN(0))
    stakeTabView.accountBalanceText =
      thousandComma(_balance.toString()) + ' LINE'
    stakeTabView.accountBalanceNumber = _balance
  })

  const maxToken = () => {
    token = stakeTabView.accountBalanceNumber
  }

  $: {
    if (token?.gt(stakeTabView.accountBalanceNumber)) {
      maxToken()
    }
  }
</script>

<div class="form-control w-full">
  <div>
    <div class="flex my-2 gap-3 place-content-between">
      <span>Balance:</span>
      <span>{stakeTabView.accountBalanceText}</span>
    </div>
    <div class="flex items-center">
      <button
        on:click|preventDefault={() => maxToken()}
        class="btn btn-sm btn-ghost mr-2"
      >
        Max
      </button>
      <BigNumberInput bind:value={token} />
    </div>
  </div>
</div>
<div>
  <p class="my-1">
    Unstaked tokens will be made available pending a release period of ~12hrs (1
    epochs).
  </p>
  <button
    on:click|preventDefault={() => signStakeFungibleToken(token)}
    class="btn btn-secondary w-full"
    class:loading={$stakeFungibleToken.loading}
    class:btn-disabled={$stakeFungibleToken.loading || !token?.gt(new BN(0))}
  >
    Stake
  </button>
</div>
