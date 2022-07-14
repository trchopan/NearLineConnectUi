<script lang="ts">
  import {Router, Route} from 'svelte-navigator'
  import Navigation from '@/presentation/pages/App/Navigation.svelte'
  import Faucet from '@/presentation/pages/Faucet/page.svelte'
  import Staking from '@/presentation/pages/Staking/page.svelte'
  import Home from '@/presentation/pages/Home/page.svelte'
  import {authCheck as liffAuthCheck} from '@/application/useLiffAuth'
  import {authCheck as nearWalletCheck} from '@/application/useNearAuth'
  import {onMount} from 'svelte'

  onMount(async () => {
    liffAuthCheck()
    nearWalletCheck()
  })
</script>

<main>
  <Router>
    <Navigation />
    <div class="px-5 max-w-xl mx-auto">
      <Route path="/"><Home /></Route>
      <Route path="faucet"><Faucet /></Route>
      <Route path="staking"><Staking /></Route>
    </div>
  </Router>
</main>
