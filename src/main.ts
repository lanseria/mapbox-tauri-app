import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

// import { devtools } from '@vue/devtools'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import '@arco-design/web-vue/dist/arco.css'

// if (process.env.NODE_ENV === 'development')
//   devtools.connect('0.0.0.0', 8090)

const app = createApp(App)

app.use(ArcoVue, {})
app.use(ArcoVueIcon)

app.mount('#app')
