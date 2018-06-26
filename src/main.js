// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bulma/css/bulma.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import http from './assets/js/http.js'

import '@/assets/css/index.css'
Vue.config.productionTip = false
Vue.use(iView);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
