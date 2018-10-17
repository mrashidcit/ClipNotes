const state = {
  notes: [],
  filter: [],
  tags: [],
  selected: []
}

const mutations = {
  INIT (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          break
        case 'filter':
          break
        case 'tags':
          break
        case 'selected':
          break
        default: break
      }
    }
  },
  CLEAR (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          break
        case 'filter':
          break
        case 'tags':
          break
        case 'selected':
          break
        default: break
      }
    }
  },
  ADD (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          break
        case 'filter':
          break
        case 'tags':
          break
        case 'selected':
          break
        default: break
      }
    }
  },
  REMOVE (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          break
        case 'filter':
          break
        case 'tags':
          break
        case 'selected':
          break
        default: break
      }
    }
  },
  UPDATE (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          break
        case 'filter':
          break
        case 'tags':
          break
        case 'selected':
          break
        default: break
      }
    }
  }
}

const actions = {
  initNotes ({ commit }, config) {
    commit('INIT', config)
  },
  clearNotes ({ commit }, config) {
    commit('CLEAR', config)
  },
  addNote ({ commit }, config) {
    commit('ADD', config)
  },
  removeNote ({ commit }, config) {
    commit('REMOVE', config)
  },
  updateNote ({ commit }, config) {
    commit('UPDATE', config)
  }
}

function validate (config) {
  return true
}

export default {
  state,
  mutations,
  actions
}
