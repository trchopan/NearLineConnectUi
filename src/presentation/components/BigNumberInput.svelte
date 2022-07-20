<script lang="ts">
  import BN from 'bn.js'
  import {thousandComma} from '../helpers'

  export let value: BN | undefined = undefined

  let numberTxt = ''

  $: {
    numberTxt = thousandComma(value.toString())
  }

  $: {
    numberTxt = thousandComma(
      numberTxt.replace(/^0/, '').replace(/\..*/, '').replaceAll(/[^\d]/g, '')
    )
    value = new BN(numberTxt.replaceAll(',', ''))
  }
</script>

<input
  type="text"
  placeholder="0"
  inputmode="numeric"
  class="input input-md input-bordered w-full font-medium text-2xl text-right number-separator"
  bind:value={numberTxt}
/>
