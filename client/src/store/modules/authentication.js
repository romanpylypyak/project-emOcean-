const state = {
  token: '',
  user: '',
  notifyRegistered: false,
  notifyReset: false
}
const getters = {
  getToken: state => {
    return state.token
  },
  notifyRegistered: state => {
    return state.notifyRegistered
  },
  notifyReset: state => {
    return state.notifyReset
  }
}
const mutations = {
  signin (state, payload) {
    state.token = payload.token
    state.user = payload.user
  },
  notifyRegistered (state, boolean) {
    state.notifyRegistered = boolean
  },
  notifyReset (state, boolean) {
    state.notifyReset = boolean
  },
  logOut (state, payload) {
    state.token = payload.token
    state.user = payload.user
  }
}
const actions = {
  signin ({ commit }, payload) {
    return commit('signin', payload)
  },
  notifyRegistered ({ commit }, boolean) {
    return commit('notifyRegistered', boolean)
  },
  notifyReset ({ commit }, boolean) {
    return commit('notifyReset', boolean)
  },
  logOut ({ commit }) {
    let payload = { token: '', user: '' }
    commit('logOut', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
