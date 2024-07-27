import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';
import Toast from 'vue-toastification';
import VueAwesomePaginate from "vue-awesome-paginate";

import "vue-awesome-paginate/dist/style.css";
import "jquery/dist/jquery.min.js";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.min.js";
import "vue-toastification/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(VueAwesomePaginate);
app.use(Toast);
app.use(router);
app.use(pinia);
app.mount('#app');