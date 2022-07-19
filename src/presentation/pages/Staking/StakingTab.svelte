<script lang="ts">
  import {fungibleAccountBalance} from '@/application/useNearFungible'
  import {thousandComma} from '@/presentation/helpers'
  import BigNumberInput from '@/presentation/components/BigNumberInput.svelte'
  import BN from 'bn.js'

  let token = 0

  interface StakeTabView {
    accountBalanceText: string
    accountBalanceNumber: BN
  }

  let stakeTabView: StakeTabView = {
    accountBalanceText: 'Loading...',
    accountBalanceNumber: new BN('0'),
  }

  $: $fungibleAccountBalance.onHasData(data => {
    const _balance = data.balance.getOrElse(new BN('0'))
    stakeTabView.accountBalanceText =
      thousandComma(_balance.toString()) + ' LINE'
    stakeTabView.accountBalanceNumber = _balance
  })
</script>

<div class="form-control w-full">
  <div>
    <div class="flex my-2 gap-3 place-content-between">
      <span>Balance:</span>
      <span>{stakeTabView.accountBalanceText}</span>
    </div>
    <BigNumberInput bind:value={token} />
  </div>
</div>
<div>
  <p class="my-1">
    Unstaked tokens will be made available pending a release period of ~12hrs (1
    epochs).
  </p>
  <button class="btn btn-secondary w-full">Stake</button>
</div>
