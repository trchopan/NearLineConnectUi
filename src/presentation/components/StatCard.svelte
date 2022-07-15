<script lang="ts">
  export let titleAndValues: {title: string; value: string}[] = []
  export let primary = false

  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<div
  class={`card shadow ${primary ? 'bg-primary' : ''}`}
  on:click={() => dispatch('click')}
>
  <div class="card-body">
    {#each titleAndValues as t}
      <div class="sm:flex place-content-between">
        <h2 class="card-title">
          {t.title}
        </h2>
        <h2 class="font-medium text-2xl">
          {t.value}
        </h2>
      </div>
    {/each}
    <div>
      <slot />
    </div>
  </div>
</div>
