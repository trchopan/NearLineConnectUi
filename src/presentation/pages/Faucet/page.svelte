<script lang="ts">
  import {Icon} from '@steeze-ui/svelte-icon'
  import {User} from '@steeze-ui/heroicons'
  import Interval from '../../components/Interval.svelte'
  import StatCard from '../../components/StatCard.svelte'
  import BigNumberInput from '../../components/BigNumberInput.svelte'

  let token = 1_000
</script>

<div class="flex items-center place-content-between">
  <h1 class="font-medium text-3xl">Faucet</h1>
  <Interval
    duration={15_000}
    on:action={() => console.log('nanii Faucet')}
    tooltip="Refresh Contract information"
  />
</div>

<div class="mt-5 flex flex-col gap-5">
  <StatCard
    titleAndValues={[
      {
        title: 'Faucet Ballance',
        value: '89,400,231,432 LINE',
      },
    ]}
    primary
  />

  <StatCard
    titleAndValues={[
      {
        title: 'Allow token to claim',
        value: '123,456,789 LINE',
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
        One account can get max 10,000 LINE. You cannot get more!
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
