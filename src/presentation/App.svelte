<script lang="ts">
  import {Router, Route} from 'svelte-navigator'
  import Navigation from './components/Navigation.svelte'
  import Faucet from './pages/Faucet/page.svelte'
  import Staking from './pages/Staking/page.svelte'
  import Home from './pages/Home/page.svelte'
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
