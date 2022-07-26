<script lang="ts">
  import LineLogo from '@/assets/LINE_logo.svg'
  import NearLogo from '@/assets/near-logo.svg'
</script>

<div class="grid grid-cols-2 mt-3 mb-10">
  <div class="flex flex-col sm:flex-row justify-center items-center">
    <img src={LineLogo} class="w-8 h-8 mr-1" alt="0" />
    <slot name="left"></slot>
  </div>
  <div class="flex flex-col sm:flex-row justify-center items-center">
    <img
      src={NearLogo}
      class="w-8 h-8 mr-1 bg-black px-1 py-1 rounded"
      alt="0"
    />
    <slot name="right"></slot>
  </div>
</div>
