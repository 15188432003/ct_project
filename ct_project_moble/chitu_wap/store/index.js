import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import model from './modules/model'
// import getters from './getters'

const store = new Vuex.Store({
    modules: {
        model
    },
    // getters
})

export default store