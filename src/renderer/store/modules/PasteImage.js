const state = {
  source: null
}

const mutations = {
  SET_SOURCE (state, _path) {
    if (_path) {
      state.source = _path
    }
  },
  CLEAR_SOURCE (state) {
    state.source = null
  }
}

const actions = {
  setSource ({ commit }, _path) {
    if (_path) {
      commit('SET_SOURCE', _path)
    }
  },
  clearSource ({ commit }) {
    commit('CLEAR_SOURCE')
  }
}

export default {
  state,
  mutations,
  actions
}
