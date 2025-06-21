import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; //Import your router

const app = createApp(App)

app.use(router) //Vue to use your router
app.mount('#app')
