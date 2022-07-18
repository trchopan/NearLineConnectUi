<script lang="ts">
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher<{close: void}>()
  export let open = false

  const onClose = () => {
    open = false
    dispatch('close')
  }
</script>

<div class="modal" class:modal-open={open}>
  <div class="modal-box">
    <!-- TODO: Implement title and styling -->
    <h3 class="font-bold text-lg">Error!!!!</h3>
    <p class="py-4">
      <slot />
    </p>
    <div class="modal-action">
      <button on:click|preventDefault={onClose} for="my-modal" class="btn">
        Close
      </button>
    </div>
  </div>
</div>
