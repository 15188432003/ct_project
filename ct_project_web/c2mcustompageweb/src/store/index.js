import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import lens from "./modules/lens";
export default new Vuex.Store({
  modules: {
    lens,
  },
  state: {},
  mutations: {},
  actions: {},
});
