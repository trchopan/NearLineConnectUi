import App from '@/presentation/pages/App/App.svelte'
import '@/presentation/app.css'
import * as buffer from "buffer";

(window as any).Buffer = buffer.Buffer;

const app = new App({
  target: document.getElementById('app')
})

export default app
