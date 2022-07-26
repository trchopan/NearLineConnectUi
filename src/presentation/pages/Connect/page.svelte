<script lang="ts">
  import LineNearLogo from '@/assets/line-near-logo.jpg'
  import GotenFusion from '@/assets/goten-fusion.jpeg'
  import SuccessFussion from '@/assets/success-fussion.jpg'
  import {
    lineIdByWallet,
    getLineIdByWallet,
  } from '@/application/useNearLineConnect'
  import {liffProfile} from '@/application/useLiffAuth'
  import {nearProfile} from '@/application/useNearAuth'
  import GetRegistrationSignature from './GetRegistrationSignature.svelte'
  import FusionLineNearGrid from './FusionLineNearGrid.svelte'
  import {partialRight} from 'lodash'
  import {login as lineLogin} from '@/application/useLiffAuth'
  import {login as nearLogin} from '@/application/useNearAuth'

  liffProfile.subscribe(_liffProfile =>
    nearProfile.subscribe(_nearProfile =>
      _liffProfile.onHasData(() =>
        _nearProfile.onHasData(({accountId}) => {
          getLineIdByWallet(accountId)
        })
      )
    )
  )

  const _onLogin = (login: string) => {
    switch (login) {
      case 'line':
        if ($liffProfile.hasData) return
        lineLogin()
        break
      case 'near':
        if ($nearProfile.hasData) return
        nearLogin()
        break
      default:
        throw new Error('Must provide "line" or "near"')
    }
  }
  const onLoginLine = partialRight(_onLogin, 'line')
  const onLoginNear = partialRight(_onLogin, 'near')
</script>

<div>
  <img src={LineNearLogo} alt="0" class="w-full max-w-sm mx-auto" />
</div>

{#if !$lineIdByWallet.hasData || $lineIdByWallet.value?.isLeft}
  <h1
    class="bg-primary text-white text-lg font-bold text-center my-5 px-5 py-3"
  >
    Prepare for the FUSION !!!!!
  </h1>
  <div>
    <img src={GotenFusion} alt="0" class="w-full max-w-sm mx-auto flashit" />
    {#if $lineIdByWallet.loading}
      <div class="max-w-sm mx-auto">
        <progress class="progress w-full" />
      </div>
    {:else}
      <FusionLineNearGrid>
        <button
          on:click|preventDefault={() => onLoginLine()}
          slot="left"
          class="btn btn-ghost btn-sm"
        >
          {$liffProfile.notInited || $liffProfile.hasError
            ? 'Login LINE'
            : $liffProfile.value?.displayName.getOrCrash() || 'Loading'}
        </button>
        <button
          on:click|preventDefault={() => onLoginNear()}
          slot="right"
          class="btn btn-ghost btn-sm"
        >
          {$nearProfile.notInited || $nearProfile.hasError
            ? 'Login NEAR'
            : $nearProfile.value?.accountId.getOrCrash() || 'Loading'}
        </button>
      </FusionLineNearGrid>
    {/if}
  </div>

  {#if $liffProfile.hasData && $nearProfile.hasData}
    <div>
      <h3 class="font-medium text-md">
        Begin connect your Line Profile and Near Wallet
      </h3>
      <GetRegistrationSignature register />
    </div>
  {/if}
{:else}
  <h1
    class="bg-primary text-lg font-bold text-center my-5 px-5 py-3"
  >
    FUSION SUCCESS !!!
  </h1>

  <div>
    <img src={SuccessFussion} alt="0" class="w-full max-w-sm mx-auto" />
  </div>
  <FusionLineNearGrid>
    <span slot="left">{$liffProfile.value?.displayName.getOrCrash()}</span>
    <span slot="right">{$nearProfile.value?.accountId.getOrCrash()}</span>
  </FusionLineNearGrid>
  <hr class="my-3" />
  <div>
    <h3 class="font-medium text-md">
      Break Connect your Line profile and Near wallet
    </h3>
    <GetRegistrationSignature unregister />
  </div>
{/if}

<style>
  .flashit {
    animation: flash ease-out 8s infinite, scale ease-out 5s infinite;
    animation-delay: 2s;
  }
  @keyframes flash {
    0% {
      opacity: 1;
    }
    2% {
      opacity: 0;
    }
    3% {
      opacity: 0.6;
    }
    4% {
      opacity: 0.2;
    }
    6% {
      opacity: 0.9;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes scale {
    0% {
      transform: rotate(0deg);
    }
    48% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(3deg);
    }
    52% {
      transform: rotate(-3deg);
    }
    53% {
      transform: rotate(2deg);
    }
    54% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>
