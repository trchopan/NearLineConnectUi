<script lang="ts">
  export let titleAndValues: {title: string; value: string}[] = []
  export let primary = false
</script>

<div class={`card shadow ${primary ? 'bg-primary' : ''}`}>
  <div class="card-body">
    {#each titleAndValues as t}
      <div class="sm:flex place-content-between">
        <h2 class="card-title">{t.title}</h2>
        <h2 class="font-medium text-2xl">{t.value}</h2>
      </div>
    {/each}
    <div>
      <slot />
    </div>
  </div>
</div>
