<script lang="ts">
  import LineLogo from '@/assets/LINE_logo.svg'
  import NearLogo from '@/assets/near-logo.svg'
  import {Link} from 'svelte-navigator'
  import {Icon} from '@steeze-ui/svelte-icon'
  import {MenuAlt2} from '@steeze-ui/heroicons'
  import {userProfile, login, logout} from '@/application/useLiffAuth'

  interface PageRoute {
    link: string
    text: string
  }
  const pages: PageRoute[] = [
    {link: '/staking', text: 'Staking'},
    {link: '/faucet', text: 'Faucet'},
    {link: '/nft', text: 'NFT'},
  ]

  $: lineDropdown = $userProfile.match({
    notInited: () => ({
      onClick: () => login(),
      button: 'Login',
      menuText: 'Login with LINE Liff',
    }),
    loading: () => ({onClick: () => undefined, button: 'Loading', menuText: ''}),
    hasData: data => ({
      onClick: () => logout(),
      button: data.displayName.getOrCrash(),
      menuText: 'Logout LINE',
    }),
    hasError: err => ({
      onClick: () => login(),
      button: 'Login',
      menuText: 'Login with LINE Liff',
    }),
  })
</script>

<div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">
        <Icon src={MenuAlt2} theme="solid" class="h-5 w-5 color-gray-900" />
      </label>
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        {#each pages as page}
          <li><Link to={page.link}>{page.text}</Link></li>
        {/each}
      </ul>
    </div>
    <h1 class="px-2 font-medium text-xl">
      <Link to="/">Near 🔗 Line Demo</Link>
    </h1>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal p-0">
      {#each pages as page}
        <li><Link to={page.link}>{page.text}</Link></li>
      {/each}
    </ul>
  </div>
  <div class="navbar-end">
    <div class="flex flex-col items-end">
      <div class="dropdown dropdown-end">
        <button
          tabindex="0"
          class={`btn btn-xs m-1 normal-case ${
            $userProfile.loading ? 'btn-disabled' : ''
          }`}
        >
          <img src={LineLogo} class="w-3 h-3 mr-2" alt="0" />
          <span>{lineDropdown.button}</span>
        </button>
        {#if lineDropdown.menuText}
          <ul
            tabindex="0"
            class="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box whitespace-nowrap"
          >
            <li>
              <span on:click|preventDefault={lineDropdown.onClick}>
                {lineDropdown.menuText}
              </span>
            </li>
          </ul>
        {/if}
      </div>

      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-xs m-1 normal-case">
          <img src={NearLogo} class="w-3 h-3 mr-2" alt="0" />
          <span>choptr.testnet</span>
        </button>
        <ul
          tabindex="0"
          class="dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box whitespace-nowrap"
        >
          <li>
            <span>Disconnect NEAR</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
