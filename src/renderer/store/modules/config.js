const state = {
  about: {
    state: false
  },
  new: {
    state: false
  },
  add: {
    state: false,
    data: null,
    type: null
  },
  edit: {
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
  actionDialog: {
    state: false,
    title: '',
    message: '',
    pLabel: 'Yes',
    nLabel: 'No',
    pCallback: () => {},
    nCallback: () => {}
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
        case 'new':
          clearViews()
          state.new.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'edit':
          clearViews()
          state.edit.data = ('data' in config && config.data) ? config.data : null
          state.edit.state = ('state' in config && config.state) ? 1 : 0
          break
        case 'viewNote':
          state.viewNote.state = ('state' in config && config.state) ? 1 : 0
          state.viewNote.data = ('data' in config && config.data) ? config.data : null
          break
        case 'genericMessage':
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
        case 'actionDialog':
          state.actionDialog.state = ('state' in config && config.state) ? 1 : 0
          state.actionDialog.title = ('title' in config && config.title) ? config.title : ''
          state.actionDialog.message = ('message' in config && config.message) ? config.message : ''
          state.actionDialog.pLabel = ('pLabel' in config && config.pLabel) ? config.pLabel : 'Yes'
          state.actionDialog.nLabel = ('nLabel' in config && config.nLabel) ? config.nLabel : 'No'
          state.actionDialog.pCallback = ('pCallback' in config && typeof config.pCallback === 'function')
            ? config.pCallback : () => {}
          state.actionDialog.nCallback = ('nCallback' in config && typeof config.nCallback === 'function')
            ? config.nCallback : () => {}
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
  state.about.state = false
  state.genericMessage.state = false
  state.genericMessage.message = ''
  state.viewNote.state = false
  state.viewNote.data = null
  state.add.state = false
  state.add.data = null
  state.add.type = null
  state.edit.state = false
  state.edit.data = null
  state.loading.state = false
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
