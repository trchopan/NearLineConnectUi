<script lang="ts">
  import BN from 'bn.js'
  import {onMount} from 'svelte'

  export let value: BN | undefined = undefined

  let numberTxt = ''

  $: {
    numberTxt = String(value ?? '')
  }

  $: {
    numberTxt = numberTxt.replace(/^0/, '')
    if (numberTxt !== '') {
      value = new BN(numberTxt.replaceAll(',', ''))
    }
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
