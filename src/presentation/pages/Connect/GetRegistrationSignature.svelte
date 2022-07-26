<script lang="ts">
  import {
    getRegistrationSignature,
    registrationSignature,
    signRecordLineId,
    signRemoveLineId,
  } from '@/application/useNearLineConnect'
  import {liffProfile} from '@/application/useLiffAuth'
  import {nearProfile} from '@/application/useNearAuth'
  import type {Signature} from '@/domain/connect/Signature'
  import type {LiffProfile} from '@/domain/liff/LiffProfile'
  import type {NearProfile} from '@/domain/near/NearProfile'
  import {partialRight} from 'lodash'
  import {onMount} from 'svelte'
  import {formatDistanceToNow} from 'date-fns'

  export let register = false
  export let unregister = false

  onMount(() => {
    if (!register && !unregister) {
      throw new Error(
        'GetRegistrationSignature: Must provide register or unregister'
      )
    }
  })

  const _onSignRecordLineId = (
    signature: Signature,
    liffProfile: LiffProfile,
    nearProfile: NearProfile,
    isRemove: boolean
  ) => {
    const payload = {
      signature: signature.signature,
      expire: signature.expire.getTime(),
      line_id: liffProfile.lineId,
      wallet: nearProfile.accountId,
    }
    if (isRemove) {
      signRemoveLineId(payload)
    } else {
      signRecordLineId(payload)
    }
  }
  const onSignRecordLineId = partialRight(_onSignRecordLineId, false)
  const onSignRemoveLineId = partialRight(_onSignRecordLineId, true)
</script>

{#if $registrationSignature.notInited}
  <div class="flex justify-center">
    <button
      on:click={() =>
        getRegistrationSignature({
          line_id: $liffProfile.value.lineId,
          wallet_id: $nearProfile.value.accountId,
        })}
      class="btn btn-primary"
      class:btn-outline={unregister}
    >
      Get Signature
    </button>
  </div>
{:else if $registrationSignature.loading}
  <div>Getting Signature...</div>
{:else if $registrationSignature.hasError}
  <pre>{JSON.stringify($registrationSignature, null, 2)}</pre>
{:else if $registrationSignature.hasData}
  <div class="truncate">
    Token: <span>{$registrationSignature.value?.signature}</span>
  </div>
  <div>Expire: {formatDistanceToNow($registrationSignature.value?.expire)}</div>
  <div class="mt-10 flex flex-col justify-center">
    {#if register}
      <button
        on:click|preventDefault={() =>
          onSignRecordLineId(
            $registrationSignature.value,
            $liffProfile.value,
            $nearProfile.value
          )}
        class="btn btn-primary my-5"
      >
        Submit Registration
      </button>
    {/if}

    {#if unregister}
      <button
        on:click|preventDefault={() =>
          onSignRemoveLineId(
            $registrationSignature.value,
            $liffProfile.value,
            $nearProfile.value
          )}
        class="btn btn-secondary my-5"
      >
        Submit Un-registration
      </button>
    {/if}
  </div>
{/if}
