const state = {
  about: {
    state: false
  },
  add: {
    state: false,
    note: null
  },
  delete: {
    state: false,
    note: null
  },
  preview: {
    state: false,
    note: null
  },
  loader: {
    state: true
  }
}

const mutations = {
  SET_STATE (state, config) {
    const note = config.note || null
    if (validate(config)) {
      switch (config.name) {
        case 'about':
          state.about.state = config.state
          break
        case 'add':
          state.add.state = config.state
          break
        case 'delete':
          if (note) {
            // To Do. Prepare for Delete
          }
          break
        case 'preview':
          break
        case 'loader':
          break
        default: break
      }
    }
  }
}

const actions = {
  setState ({ commit }, config) {
    // do something async
    commit('SET_STATE', config)
  }
}

function validate (config) {
  if (!(
    config && 'name' in config && config.name &&
    'state' in config
  )) {
    return false
  }
  return true
}

export default {
  state,
  mutations,
  actions
}
