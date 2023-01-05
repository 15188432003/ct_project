import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { VueAxios } from "./utils/request";
import "./global.less";
import "./utils/flexible"; //自适应屏幕

import "./core/lazy_use.js";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

Vue.config.productionTip = false;

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
