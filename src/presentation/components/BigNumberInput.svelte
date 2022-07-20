<script lang="ts">
  import BN from 'bn.js'
  import {onMount} from 'svelte'

  export let value: BN = new BN('0')
  export let initial: number | undefined = undefined

  let numberTxt = ''

  $: {
    if (initial !== undefined) {
      numberTxt = String(initial)
    }
  }

  $: {
    numberTxt = numberTxt.replace(/^0/, '')
    value = new BN(numberTxt.replaceAll(',', ''))
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
