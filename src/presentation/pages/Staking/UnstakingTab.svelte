<script lang="ts">
  import BigNumberInput from '../../components/BigNumberInput.svelte'

  let token = 0
</script>

<div class="form-control w-full">
  <div>
    <div class="flex my-2 gap-3 place-content-between">
      <span>Staked balance:</span>
      <span>950 LINE</span>
    </div>
    <BigNumberInput bind:value={token} />
  </div>
</div>
<div>
  <p class="my-1">
    Unstaked tokens will be made available pending a release period of ~12hrs (1
    epochs).
  </p>
  <button class="btn btn-secondary w-full">Unstake</button>
</div>
