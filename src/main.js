// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'
import VueResource from 'vue-resource'
import moment from 'moment'

Vue.use(VueResource)
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    localStorage.removeItem('user');
  }
  let user = JSON.parse(localStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
