import Vue from 'vue'
import Vuex from '../vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: 'bd',
    age: 10
  },
  getters: {
    addAge (state) {
      return state.age + 10
    }
  },
  mutations: {
    changeName (state, payload) {
      state.name = payload
    },
    changeAge (state, payload) {
      state.age = state.age + payload
    }
  },
  actions: {
    changeAge ({ commit }, payload) {
      setTimeout(() => commit('changeAge', payload), 1000)
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        name: 'name a',
        age: 1
      },
      getters: {
        getName (state) {
          return state.name
        }
      },
      mutations: {
        changeAge (state, payload) {
          state.age = state.age + payload
        }
      },
      modules: {
        c: {
          namespaced: true,
          state: {
            name: 'name c',
            age: 3
          }
        }
      }
    },
    b: {
      namespaced: true,
      state: {
        name: 'name b',
        age: 2
      },
      mutations: {
        changeAge (state, payload) {
          state.age = state.age + payload
        }
      }
    }
  }
})
