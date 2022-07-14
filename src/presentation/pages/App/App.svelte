<script lang="ts">
  import {Router, Route} from 'svelte-navigator'
  import Navigation from '@/presentation/pages/App/Navigation.svelte'
  import Faucet from '@/presentation/pages/Faucet/page.svelte'
  import Staking from '@/presentation/pages/Staking/page.svelte'
  import Home from '@/presentation/pages/Home/page.svelte'
  import {authCheck} from '@/application/useLiffAuth'
  import {onMount} from 'svelte'

  onMount(async () => {
    await authCheck()
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
