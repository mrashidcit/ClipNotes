<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>

<script>
const { ipcRenderer, clipboard } = require('electron')
const os = require('os')
const path = require('path')

export default {
  name: 'app',
  mounted () {
    const context = this
    this.$nextTick(function () {
      this.registerEvents()
      this.init()
      document.onpaste = function (e) {
        e.preventDefault()
        if (!context.$store.state.config.add.state) {
          context.onPaste()
        }
      }
    })
  },
  methods: {
    registerEvents () {
      const context = this
      this.$root.$on('sql', function (config) {
        ipcRenderer.send('sql', config)
      })
      ipcRenderer.on('sql_read', function (event, config) {
        if (config && config.constructor === {}.constructor &&
          'for' in config && 'stage' in config && 'data' in config &&
          config.for && config.stage) {
          switch (config.stage) {
            case 'init':
              // For full initialization
              context.$store.dispatch('initEntries', {
                entry: config.for,
                source: config.data
              })
              break
            case 'singleEntry':
              // For single entry read
              break
            default: break
          }
        }
      })
    },
    init () {
      // Read notes form SQL
      this.$root.$emit('sql', {
        command: 'READ',
        sql: 'SELECT * FROM notes',
        data: null,
        for: 'notes',
        stage: 'init'
      })
      // Read filter from SQL
      this.$root.$emit('sql', {
        command: 'READ',
        sql: 'SELECT * FROM filter',
        data: null,
        for: 'filter',
        stage: 'init'
      })
      // Read tags from SQL
      this.$root.$emit('sql', {
        command: 'READ',
        sql: 'SELECT * FROM tags',
        data: null,
        for: 'tags',
        stage: 'init'
      })
    },
    onPaste () {
      const context = this
      switch (os.platform()) {
        case 'win32':
          break
        case 'darwin':
          const formatList = clipboard.availableFormats()
          console.log(formatList)
          if (
            formatList &&
            formatList.constructor === [].constructor &&
            formatList.findIndex(x => x === 'image/png') > -1
          ) {
            // Found Image
            context.$store.dispatch('setState', {
              name: 'loading',
              state: true
            })
            setTimeout(function () {
              let helperWindow = new context.$electron.remote.BrowserWindow(
                {
                  parent: context.$electron.remote.getCurrentWindow(),
                  modal: true,
                  width: 500,
                  maxWidth: 500,
                  height: 150,
                  maxHeight: 150,
                  backgroundColor: '#FFFFFF',
                  webPreferences: {
                    devTools: false
                  },
                  show: true
                }
              )
              helperWindow.loadFile(
                path.join(
                  __static,
                  'loadImage.html'
                )
              )
              getImageData()
                .then(function (data) {
                  context.$store.dispatch('setState', {
                    name: 'add',
                    state: true,
                    data: data,
                    type: 'IMAGE'
                  })
                  helperWindow.close()
                  context.$store.dispatch('setState', {
                    name: 'loading',
                    state: false
                  })
                })
                .catch(function (err) {
                  console.log('invalid type', err)
                  helperWindow.close()
                  context.$store.dispatch('setState', {
                    name: 'loading',
                    state: false
                  })
                  context.$store.dispatch('setState', {
                    name: 'genericMessage',
                    state: true,
                    data: 'Unable to create note! Please paste any Image or Text data to create notes.'
                  })
                })
            }, 100)
          } else if (
            formatList &&
            formatList.constructor === [].constructor &&
            formatList.findIndex(x => x === 'text/plain') > -1
          ) {
            // Found Text
            console.log('app:onPaste:darwin:hasText')
            console.log(clipboard.readRTF())
            this.$store.dispatch('setState', {
              name: 'add',
              state: true,
              data: clipboard.readText(),
              type: 'TEXT'
            })
          }
          break
        case 'linux':
          break
        default:
          // Not supported other OS platforms.
          break
      }
    }
  }
}
async function getImageData () {
  const promise = new Promise(function (resolve, reject) {
    const nImageHigh = clipboard.readImage()
    const size = nImageHigh.getSize()
    const thumbnailSize = proportionalScale(
      [size.width, size.height],
      [250, 250]
    )
    const repImageSize = proportionalScale(
      [size.width, size.height],
      [500, 500]
    )
    console.log('thumbnailSize:', thumbnailSize)
    console.log('repImageSize:', repImageSize)
    const repImage = nImageHigh.resize({
      width: repImageSize[0],
      height: repImageSize[1],
      quality: 'good'
    })
    const thumbnailImage = nImageHigh.resize({
      width: thumbnailSize[0],
      height: thumbnailSize[1],
      quality: 'good'
    })
    const lQuality = repImage.toDataURL()
    const thumbnail = thumbnailImage.toDataURL()
    const hQuality = nImageHigh.toDataURL()
    if (lQuality && hQuality && thumbnail &&
      lQuality.split('data:image/png;base64,')[1] &&
      hQuality.split('data:image/png;base64,')[1] &&
      thumbnail.split('data:image/png;base64,')[1]) {
      resolve({ lQuality: lQuality, hQuality: hQuality, thumbnail: thumbnail })
    } else {
      reject(new Error('Output image data url is invalid'))
    }
  })
  await promise
  return promise
}

function proportionalScale (originalSize, newSize) {
  var ratio = originalSize[0] / originalSize[1]

  var maximizedToWidth = [newSize[0], newSize[0] / ratio]
  var maximizedToHeight = [newSize[1] * ratio, newSize[1]]

  if (maximizedToWidth[1] > newSize[1]) {
    return maximizedToHeight
  } else {
    return maximizedToWidth
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .wrapper {
    padding: 10px;
  }
  .text-clamp {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; 
  }
  .text-clamp {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; 
  }
  .text-clamp[single-line] {
    -webkit-line-clamp: 1;
  }
  .hero-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .hero-x-y {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .glass-view {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.774);
    z-index: 600;
    overflow-y: auto;
  }
  .editor-buttons-bar {
    line-height: 50px;
    background-color: #E7E7E7;
  }
  #app {
    position: fixed;
    top: 0; left: 0;
    bottom: 0; right: 0;
    background-color: #F7F7F7;
  }
  ::-webkit-scrollbar {
    width: 0;
    background: transparent
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
  #app-sidebar {
    position: fixed;
    left: 0; top: 0; bottom: 0;
    width: 300px;
    background-color: #FFFFFF;
    border-right-style: solid;
    border-right-color: #F9F9F9;
    border-right-width: 1px;
  }
  #app-sidebar > .sidebar-title {
    line-height: 50px;
  }
  .sidebar-title .logo {
    height: 30px;
    width: auto;
    padding: 0 10px;
    vertical-align: middle;
  }
  .sidebar-title .options {
    float: right;
  }
  #app-sidebar > .sidebar-info {
    background-color: rgba(60, 169, 113, 0.158);
    min-height: 120px;
  }
  .sidebar-info > .filter-count {
    margin: 0 0 0 15px;
    font-size: 30px;
    padding: 0;
  }
  #app-sidebar > .sidebar-tags {
    height: 200px;
    overflow-y: auto;
  }
  #app-content {
    position: fixed;
    left: 300px;
    top: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .important-info-box {
    background-color: rgba(60, 169, 113, 0.322);
    height: auto;
    padding: 10px;
    width: 300px;
    margin: 10px 0;
    border-style: solid;
    border-color: rgba(41, 56, 75, 0.486);
    border-width: 5px;
  }
  .important-info-box > p {
    font-size: 14px;
    margin: 0;
    color: black;
  }
  .text-light-weight {
    font-weight: 300;
  }
  .text-primary {
    color: #30A05D;
  }
  .text-secondary {
    color: #29384B;
  }
</style>
