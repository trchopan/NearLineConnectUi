import App from '@/presentation/pages/App/App.svelte'
import '@/presentation/app.css'

// Hack Browser support for buffer and process.env
import * as buffer from 'buffer'
;(window as any).Buffer = buffer.Buffer
;(window as any).process = {env: {NEAR_NO_LOGS: undefined}}

const app = new App({
  target: document.getElementById('app'),
})

export default app
