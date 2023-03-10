import App from "./App";
import { router, RouterMount } from "./router.js"; //路径换成自己的

Vue.use(router);
// #ifndef VUE3
import Vue from "vue";
import store from "./store";
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  store,
  ...App,
});

// #ifdef H5
RouterMount(app, router, "#app");

// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif

import uView from "uview-ui";
Vue.use(uView);

// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
