const state = {
  notes: [],
  filter: [],
  tags: [],
  selected: [],
  view: {
    state: false,
    source: null
  }
}

const mutations = {
  INIT (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          if (config.source.constructor === [].constructor) {
            state.notes = Object.assign([], config.source)
          }
          break
        case 'filter':
          if (config.source.constructor === [].constructor) {
            state.filter = Object.assign([], config.source)
          }
          break
        case 'tags':
          if (config.source.constructor === [].constructor) {
            state.tags = Object.assign([], config.source)
          }
          break
        case 'selected':
          if (config.source.constructor === [].constructor) {
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
          state.selected = []
          break
        default: break
      }
    }
  },
  ADD (state, config) {
    if (validate(config)) {
      switch (config.entry) {
        case 'notes':
          if (
            'title' in config.source && 'description' in config.source &&
            'type' in config.source && 'path' in config.source &&
            'id' in config.source && 'thumbnail' in config.source
          ) {
            state.notes.push(config.source)
          }
          break
        case 'filter':
          if (
            'note' in config.source && 'tag' in config.source
          ) {
            state.filter.push(config.source)
          }
          break
        case 'tags':
          if (
            'id' in config.source && 'title' in config.source &&
            'value' in config.source
          ) {
            state.tags.push(config.source)
          }
          break
        case 'selected':
          if (
            'title' in config.source && 'description' in config.source &&
            'type' in config.source && 'path' in config.source &&
            'id' in config.source && 'thumbnail' in config.source
          ) {
            state.selected.push(config.source)
          }
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
          if (
            'title' in config.source && 'description' in config.source &&
            'type' in config.source && 'path' in config.source &&
            'id' in config.source && 'thumbnail' in config.source
          ) {
            const deleteIndex = state.selected.findIndex(x => x.id === config.source.id)
            if (deleteIndex > -1) {
              state.selected.splice(deleteIndex, 1)
            }
          }
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
  },
  VIEW_NOTE (state, config) {
    console.log(config)
    state.view.state = ('state' in config && config.state) ? 1 : 0
    state.view.source = ('source' in config && config.source.constructor === {}.constructor)
      ? config.source
      : null
  }
}

const actions = {
  initEntries ({ commit }, config) {
    commit('INIT', config)
  },
  clearEntries ({ commit }, config) {
    commit('CLEAR', config)
  },
  addEntry ({ commit }, config) {
    commit('ADD', config)
  },
  removeEntry ({ commit }, config) {
    commit('REMOVE', config)
  },
  updateEntry ({ commit }, config) {
    commit('UPDATE', config)
  },
  viewNote ({ commit }, config) {
    commit('VIEW_NOTE', config)
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
