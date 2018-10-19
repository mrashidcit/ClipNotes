const state = {
  about: {
    state: false
  },
  add: {
    state: false,
    data: null,
    type: null
  },
  delete: {
    state: false,
    data: null
  },
  preview: {
    state: false,
    data: null
  },
  loader: {
    state: true
  },
  loadImage: {
    state: false
  },
  genericMessage: {
    state: false,
    data: ''
  },
  resPath: null
}

const mutations = {
  SET_STATE (state, config) {
    if (validate(config)) {
      switch (config.name) {
        case 'about':
          clearViews()
          state.about.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'add':
          console.log('store:setState:add')
          clearViews()
          state.add.data = ('data' in config && config.data) ? config.data : null
          state.add.type = ('type' in config && config.type) ? config.type : null
          state.add.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'delete':
          break
        case 'preview':
          break
        case 'genericMessage':
          clearViews()
          state.genericMessage.state = ('state' in config && config.state) ? 1 : 0
          state.genericMessage.data = ('data' in config && config.data) ? config.data : null
          break
        case 'loader':
          break
        case 'resPath':
          state.resPath = ('data' in config && config.data) ? config.data : null
          break
        case 'loadImage':
          state.loadImage.state = ('state' in config && config.state) ? 1 : 0
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

function clearViews () {
  state.genericMessage.state = false
  state.genericMessage.message = ''
}

function validate (config) {
  if (!(config && 'name' in config && config.name)) {
    return false
  }
  return true
}

export default {
  state,
  mutations,
  actions
}
