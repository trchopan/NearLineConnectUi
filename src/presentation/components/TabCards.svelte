<script lang="ts">
  import type {SvelteComponentTyped} from 'svelte/internal'

  type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>

  import {fly} from 'svelte/transition'

  interface TabConfig {
    name: string
    component: C
    props?: C extends typeof SvelteComponentTyped<infer P> ? P : never
  }

  export let config: TabConfig[] = []

  let activeTab: string | null = config[0]?.name

  // This is a hack for sync up the transiton between in-out
  const TAB_CHANGE_DURATION = 300
  const changeTab = (tab: string) => {
    activeTab = null
    setTimeout(() => {
      activeTab = tab
    }, TAB_CHANGE_DURATION)
  }
</script>

<div class="card shadow">
  <div class="card-body">
    <div class="tabs tabs-boxed grid grid-cols-2">
      {#each config as tab}
        <span
          on:click={() => changeTab(tab.name)}
          class:tab-active={activeTab === tab.name}
          class="tab tab-lg"
        >
          {tab.name}
        </span>
      {/each}
    </div>
    {#each config as c}
      {#if c.name === activeTab}
        <div
          out:fly={{x: -100, duration: TAB_CHANGE_DURATION}}
          in:fly={{x: 100, duration: TAB_CHANGE_DURATION}}
        >
          <svelte:component this={c.component} {...c.props} />
        </div>
      {/if}
    {/each}
  </div>
</div>
