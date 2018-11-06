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
  viewNote: {
    state: false,
    data: null
  },
  loader: {
    state: true
  },
  loading: {
    state: false,
    text: 'Loading ...'
  },
  genericMessage: {
    state: false,
    data: ''
  },
  strictFilter: {
    state: false,
    data: null
  },
  tagSelection: [],
  listCount: 0,
  resPath: null,
  nextPageIndex: 10,
  nextPageIndexLoader: false
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
          clearViews()
          state.add.data = ('data' in config && config.data) ? config.data : null
          state.add.type = ('type' in config && config.type) ? config.type : null
          state.add.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'delete':
          break
        case 'viewNote':
          clearViews()
          state.viewNote.state = ('state' in config && config.state) ? 1 : 0
          state.viewNote.data = ('data' in config && config.data) ? config.data : null
          break
        case 'genericMessage':
          clearViews()
          state.genericMessage.state = ('state' in config && config.state) ? 1 : 0
          state.genericMessage.data = ('data' in config && config.data) ? config.data : null
          break
        case 'loader':
          state.loader.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'resPath':
          state.resPath = ('data' in config && config.data) ? config.data : null
          break
        case 'loading':
          state.loading.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'nextPageIndexLoader':
          state.nextPageIndexLoader = ('state' in config && config.state) ? 1 : 0
          break
        case 'listReady':
          state.listReady = ('state' in config && config.state) ? 1 : 0
          state.listCount = 0
          break
        case 'nextPageIndex':
          state.nextPageIndex += 10
          state.nextPageIndexLoader = false
          break
        case 'nextPageIndexPlusPlus':
          state.nextPageIndex += 1
          break
        case 'strictFilter':
          state.strictFilter.state = ('state' in config && config.state) ? 1 : 0
          state.strictFilter.data = ('data' in config && config.state) ? 1 : 0
          break
        case 'tagSelection':
          if ('data' in config && config.data.constructor === [].constructor) {
            state.tagSelection = Object.assign([], config.data)
          }
          break
        default: break
      }
    }
  },
  INC_STATE (state, config) {
    if (validate(config)) {
      switch (config.name) {
        case 'listCount':
          state.listCount += 1
          break
        default: break
      }
    }
  }
}

const actions = {
  setState ({ commit }, config) {
    commit('SET_STATE', config)
  },
  incState ({ commit }, config) {
    commit('INC_STATE', config)
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
