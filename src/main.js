import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { createPinia } from "pinia";
import { useCartStore } from './store/cart'

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');

const cartStore = useCartStore()
cartStore.initializeCart()