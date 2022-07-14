<script lang="ts">
  import {createEventDispatcher, onDestroy} from 'svelte'

  const dispatch = createEventDispatcher()

  export let tooltip = ''
  export let duration = 10_000 // Milliseconds
  const INTERVAL = 300
  let refreshPercent = 0

  const intervalPercent = setInterval(() => {
    refreshPercent = refreshPercent + 100 * (INTERVAL / duration)
  }, INTERVAL)

  $: {
    if (refreshPercent >= 100) {
      dispatch('action')
      refreshPercent = 0
    }
  }

  onDestroy(() => {
    clearInterval(intervalPercent)
  })
</script>

{#if tooltip}
  <div class="tooltip tooltip-bottom tooltip-left" data-tip={tooltip}>
    <div
      class="radial-progress my-progress"
      style={`--value: ${refreshPercent};`}
    />
  </div>
{:else}
  <div
    class="radial-progress my-progress"
    style={`--value: ${refreshPercent};`}
  />
{/if}

<style>
  .my-progress {
    --size: 1rem;
    --thickness: 0.2rem;
  }
</style>
