// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import $ from 'jquery'
import 'bootstrap'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';


import './bus';
import currencyFilter from './filters/currency';

window.$ = $

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true;

Vue.component('Loading',Loading)
Vue.filter('currency',currencyFilter)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
// 判斷要到達的頁面是否帶有 requiresAuth  沒有就直接放行， 有的話要經過驗證的API
  if(to.meta.requiresAuth){
    // 接API
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      console.log(response)
      if(response.data.success){
        next();
      }else{
        alert('尚未登入');
        next({
          path:'/login'
        });
      }
    });

  }else{
    next();
  }

})
