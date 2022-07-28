<script lang="ts">
  export let title: string
  export let value: string | undefined = undefined
  export let disabled: boolean = false
  export let area: boolean = false
  export let number: boolean = false
</script>

<div class="form-control w-full max-w-xs">
  <label class="label">
    <span class="label-text">{title}</span>
  </label>
  {#if area}
    <textarea
      bind:value
      placeholder={title}
      disabled={disabled}
      class="textarea textarea-bordered h-40 w-full max-w-xs"
    />
  {:else if number}
    <span>num</span>
    <input
      bind:value
      type="number"
      placeholder={title}
      disabled={disabled}
      class="input input-bordered w-full max-w-xs"
    />
  {:else}
    <input
      bind:value
      type="text"
      placeholder={title}
      disabled={disabled}
      class="input input-bordered w-full max-w-xs"
    />
  {/if}
</div>
