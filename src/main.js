import Vue from 'vue'
import store from './store/'
import ElementUI from 'element-ui'
import './assets/css/style.scss'
import router from './router/'
import Config from './config/app'
import {isLogin} from './utils/dataStorage'
import App from './App.vue'
import '@/components/component.js';

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)


Vue.prototype.$Config = Config;

Vue.use(ElementUI)

window.addEventListener('beforeunload', e => {
  sessionStorage.setItem('state', JSON.stringify(store.state));
});

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title ? to.meta.title + '-' + Config.siteName : Config.siteName;
  if(to.path === "/login") {
    next()
  }else{
    if(!store.state.userInfo) {
      next("/login")
    }else{
      next()
    }
  }
});

router.afterEach(transition => {

});


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
