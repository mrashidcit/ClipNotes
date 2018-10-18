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
          if (config.source.constructor === [].constructor) {
            console.log('store:INIT:notes:source', config.source)
            state.notes = Object.assign([], config.source)
          }
          break
        case 'filter':
          if (config.source.constructor === [].constructor) {
            console.log('store:INIT:filter:source', config.source)
            state.filter = Object.assign([], config.source)
          }
          break
        case 'tags':
          if (config.source.constructor === [].constructor) {
            console.log('store:INIT:tags:source', config.source)
            state.tags = Object.assign([], config.source)
          }
          break
        case 'selected':
          if (config.source.constructor === [].constructor) {
            console.log('store:INIT:selected:source', config.source)
            state.selected = Object.assign([], config.source)
          }
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
  if (config && 'entry' in config && 'source' in config) {
    return true
  }
  return false
}

export default {
  state,
  mutations,
  actions
}
