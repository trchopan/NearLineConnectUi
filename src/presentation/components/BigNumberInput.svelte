<script lang="ts">
  import {onMount} from 'svelte'

  export let value: number = 0
  export let initial: number | undefined = undefined

  let numberTxt = ''

  $: {
    if (initial !== undefined) {
      numberTxt = String(initial)
    }
  }

  $: {
    numberTxt = numberTxt.replace(/^0/, '')
    value = parseFloat(numberTxt.replaceAll(',', ''))
  }

  onMount(() => {
    // @ts-ignore:next-line
    easyNumberSeparator({
      selector: '.number-separator',
      separator: ',',
    })
  })
</script>

<input
  type="text"
  placeholder="0"
  inputmode="numeric"
  class="input input-md input-bordered w-full font-medium text-2xl text-right number-separator"
  bind:value={numberTxt}
/>
