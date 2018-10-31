// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import i18n from './lang';//引入国际化
Vue.config.productionTip = false


import '@/assets/index.scss' // 引入全局样式

import ElementUI from 'element-ui' //引入element-ui
import '@/assets/style/element-variables.scss'
import '@/assets/style/iconfont.css' //引入icon样式

import './mock/mock'; //引入mock

import $ from 'jquery'; //引入JQ

// 引入拖拽自定义指令
import '@/assets/js/dialogDrag.js';

Vue.use(ElementUI, {
  size: 'medium', // 默认样式的大小
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$http = axios


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
