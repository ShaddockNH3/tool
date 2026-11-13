import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './styles.css'

const app = createApp(App)
app.use(router)

// 等首个路由解析完再挂载，否则直接打开 /json-format 时侧栏会先闪一下默认工具的高亮
void router.isReady().then(() => app.mount('#app'))
