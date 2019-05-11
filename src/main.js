// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bulma/css/bulma.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import http from './assets/js/http.js';
import VueLazyload from 'vue-lazyload'
import {currency} from './util/currency'
// 下拉加载
import infiniteScroll from 'vue-infinite-scroll'
import '@/assets/css/index.css'
Vue.config.productionTip = false
// Vue.use(iView);
Vue.use(infiniteScroll);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/loading-svg/loading-bars.svg',
  attempt: 1
})
//全局过滤器
Vue.filter("currency",currency)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
