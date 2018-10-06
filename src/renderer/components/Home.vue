<template>
  <div id="id-home" @click="resetTopbar">
    <!-- + Views -->
      <!-- Top application bar -->
      <top-bar :onViewSearch="views.onViewSearch"
        :style="dialogs.noteView.state ? `filter: blur(8px);-webkit-filter: blur(8px);` : null"/>
      <!-- Search View -->
      <search :onViewSearch="views.onViewSearch"
        :tags="tags"
        :list="list"
        />
      <!-- Notes -->
      <notes v-if="!onLoading"
        :notes="list"
        :briefnoteLength="briefnote.length"
        :config="config"
        :tags="tags"
        :filter="filter"
        :onViewSearch="views.onViewSearch"
        :style="dialogs.noteView.state || views.onViewSearch ? `filter: blur(8px);-webkit-filter: blur(8px);`: null"/>
    <!-- - Views -->
    <!-- + Dialogs -->
      <!-- Generic Loader -->
      <generic-loader :config="dialogs.genericLoader" />
      <!-- View Note -->
      <view-note :state="dialogs.noteView.state" :data="dialogs.noteView.data" :config="config" />
    <!-- - Dialogs -->
  </div>
</template>

<script>
  // Import Vue Components for views
  import TopBar from './Home/TopBar'
  import Notes from './Home/Notes'
  import Search from './Home/Search'

  // Import Vue Components for dialogs
  import ViewNote from './Dialogs/ViewNote'
  import GenericLoader from './Dialogs/GenericLoader'
  import { nativeImage } from 'electron'
  
  // Import dependency modules
  const os = require('os')
  const path = require('path')
  const {
    ipcRenderer,
    clipboard
  } = require('electron')
  const uniqid = require('uniqid')
  const uri2path = require('file-uri-to-path')

  /**
   * Add platform specific dependencies.
   */
  switch (os.platform()) {
    case 'win32':
      // Add win32/windows specific dependencies
      // Windows specifc packages can be listed in package.json -> "win32Dependencies" key
      try {
        // Windows clipboard dependency.
        window.winClipboard = require('win-clipboard')
      } catch (e) {
        console.error('win-clipboard not loaded')
      }
      break
    case 'linux':
      break
    case 'darwin':
      break
    default: break
  }
  // Vue template instance
  export default {
    name: 'landing-page',
    components: {
      TopBar,
      Notes,
      ViewNote,
      GenericLoader,
      Search
    },
    props: ['config'],
    data () {
      return {
        // Show loader until application UI rendered
        onLoading: true,
        list: [
          /**
           * List of filtered notes
           * to display in the application
           */
        ],
        briefnote: [
          /**
           * Notes updated at runtime from SQL database.
           * briefnote objects: title, description, type, path, id
           */
        ],
        tags: [
          /**
           * List of all tags used by application
           * tags objects: title, value, id
           */
        ],
        filter: [
          /**
           * List of all filter data used by application
           * tags objects: note, tag
           */
        ],
        // An unique id for Home template.
        // Used for reading data broadcasted through root events.
        uid: uniqid(),
        // Manage dialogs at runtime
        dialogs: {
          // Generic loader with text message
          genericLoader: {
            text: '', // Loader message string
            state: false // Loader active state
          },
          // Note view dialog for briefnote
          noteView: {
            data: null, // Note view data object: briefnote selected object
            state: false // Note view active state
          }
        },
        // Runtime control data for component views
        views: {
          onViewSearch: false
        }
      }
    },
    methods: {
      /**
       * Add a briefnote for both runtime + database
       * @param {Object} _config - A new Note data.
       */
      addNote (_config) {
        // Validate _config object
        if (_config && _config.constructor === {}.constructor &&
          'type' in _config && 'obj' in _config) {
          // Final briefnote instance.
          let resultObj = null
          // Create and update briefnote instance.
          switch (_config.type) {
            case 'text':
              // Note type is TEXT
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'text' in _config.obj) {
                console.log(_config.obj.text)
              }
              break
            case 'html':
              // Note type is HTML
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'html' in _config.obj) {
                // Create result object
                const uid = uniqid()
                const fileName = `${uid}-${new Date().getTime()}.html`
                resultObj = {
                  title: 'Untitled Note',
                  description: '',
                  type: 'html',
                  path: path.join(
                    'resource',
                    `${fileName}`
                  ),
                  id: uid,
                  visible: false
                }
                // Save Html note into app's resource folder
                this.$root.$emit('saveHtmlFile', {
                  html: _config.obj.html,
                  name: `${fileName}`,
                  obj: resultObj
                })
              }
              break
            case 'image':
              // Note type is IMAGE from file system
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'path' in _config.obj && 'format' in _config.obj) {
                // Create image file name
                const timestamp = new Date().getTime()
                const fileName =
                  path.basename(_config.obj.path).split('.').length > 1
                    ? `${path.basename(_config.obj.path).split('.')[0]}-${timestamp}.${path.basename(_config.obj.path).split('.')[1]}`
                    : `${path.basename(_config.obj.path)}-${timestamp}.${_config.obj.format}`
                // Create result object
                resultObj = {
                  title: path.basename(_config.obj.path).split('.').length > 1
                    ? path.basename(_config.obj.path).split('.')[0]
                    : path.basename(_config.obj.path),
                  description: '',
                  type: 'image',
                  path: path.join(
                    'resource',
                    `${fileName}`
                  ),
                  id: uniqid(),
                  visible: false
                }
                // Save Image note into app's resource folder
                this.$root.$emit('saveImageFile', {
                  src: _config.obj.path,
                  name: `${fileName}`,
                  obj: resultObj
                })
              }
              break
            case 'screenshot':
              // Note type is a SCREENSHOT from clipboard
              if (_config.obj && _config.obj.constructor === {}.constructor &&
                'data' in _config.obj) {
                const timestamp = new Date().getTime()
                const uid = uniqid()
                const fileName = `${uid}-${timestamp}`
                resultObj = {
                  title: 'Untitled Screenshot',
                  description: '',
                  type: 'image',
                  path: path.join(
                    'resource',
                    `${fileName}.png`
                  ),
                  id: uid,
                  visible: false
                }
                // Save Screenshot note into app's resource folder
                this.$root.$emit('saveScreenshot', {
                  data: _config.obj.data,
                  name: `${fileName}`,
                  obj: resultObj
                })
              }
              break
            default:
              // Note type is invlaid.
              break
          }
          if (resultObj) {
            // Update briefnote in runtime data
            this.briefnote.push(resultObj)
            // Update briefnote in database
            this.$root.$emit('updateSqlEntry', {
              sql: `INSERT INTO notes(title, type, path, id) VALUES(?,?,?,?)`,
              data: [
                resultObj.title,
                resultObj.type,
                resultObj.path,
                resultObj.id
              ]
            })
            // Update runtime filter list for this new note entry, as 'Unlisted'.
            this.filter.push({
              note: resultObj.id,
              tag: 'tag_unlisted'
            })
            // Update database filter list for this new note entry, as 'Unlisted'.
            this.$root.$emit('updateSqlEntry', {
              sql: `INSERT INTO filter(note, tag) VALUES(?,?)`,
              data: [
                resultObj.id,
                'tag_unlisted'
              ]
            })
          }
        }
      },
      /**
       * Initialize application data
       */
      init () {
        // Update runtime data from SQL database
        // Request read briefnotes data
        this.$root.$emit('readSql', {
          sql: `SELECT * FROM notes`, // SQL command
          id: this.uid, // Current home component id
          selector: 'notes' // set selector for 'notes' data
        })
        // Request read tags data
        this.$root.$emit('readSql', {
          sql: `SELECT * FROM tags`, // SQL command
          id: this.uid, // Current home component id
          selector: 'tags' // set selector for 'tags' data
        })
        // Request read filter data
        this.$root.$emit('readSql', {
          sql: `SELECT * FROM filter`, // SQL command
          id: this.uid, // Current home component id
          selector: 'filter' // set selector for 'filter' data
        })
      },
      /**
       * Register application root events
       */
      registerEvents () {
        const context = this
        /**
         * When SQL data is ready to read
         * @name onSqlDataReady
         * @param {Object} _obj - Sql data
         */
        this.$root.$on('onSqlDataReady', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'rows' in _obj && 'obj' in _obj && 'id' in _obj.obj &&
            'selector' in _obj.obj) {
            if (_obj.obj.id === context.uid && _obj.rows && _obj.rows.constructor === [].constructor) {
              switch (_obj.obj.selector) {
                case 'notes':
                  _obj.rows.forEach((item) => {
                    item['visible'] = true
                    context.briefnote.push(item)
                  })
                  break
                case 'tags':
                  _obj.rows.forEach((item) => {
                    context.tags.push(item)
                  })
                  break
                case 'filter':
                  _obj.rows.forEach((item) => {
                    context.filter.push(item)
                  })
                  const tagIndex = this.tags.findIndex(x => x.id === 'tag_unlisted')
                  this.filterList([this.tags[tagIndex]])
                  break
                default: break
              }
              setTimeout(() => {
                // Set application to ready
                context.dialogs.genericLoader.state = false
                context.onLoading = false
                // TODO: reduce delay
              }, 1000)
            }
          }
        })
        /**
         * When note is saved into file system
         * @name onSaveNote
         * @param {Object} _obj - Briefnote instance used for save image
         */
        this.$root.$on('onSaveNote', (_obj) => {
          if (_obj && _obj.constructor === {}.constructor &&
            'type' in _obj && 'title' in _obj && 'path' in _obj && 'id' in _obj) {
            const targetIndex = this.briefnote.findIndex(item => item.id === _obj.id)
            if (targetIndex > -1) {
              this.briefnote[targetIndex].visible = true
              // TODO: Get current tag selection from 'tag serach view'
              const tagIndex = this.tags.findIndex(x => x.id === 'tag_unlisted')
              this.filterList([this.tags[tagIndex]])
            }
          }
        })
        /**
         * Request to show tag search view
         * @name viewSearch
         */
        this.$root.$on('viewSearch', () => {
          if (!this.views.onViewSearch) {
            this.views.onViewSearch = true
          } else {
            this.views.onViewSearch = false
          }
        })
        /**
         * Request to reset application top bar to defaults.
         * @name resetTopbar
         */
        this.$root.$on('resetTopbar', () => {
          this.views.onViewSearch = false
        })
        /**
         * Request to close note viewer
         * @name closeNoteView
         */
        this.$root.$on('closeNoteView', () => {
          this.dialogs.noteView.state = false
          this.dialogs.noteView.data = null
        })
        /**
         * Request to open 'note viewer'
         * @name closeNoteView
         * @param {Object} _obj - briefnote instance object
         */
        this.$root.$on('viewNote', (_obj) => {
          this.dialogs.noteView.data = _obj
          this.dialogs.noteView.state = true
        })
        /**
         * Save tags on selected note
         * @name saveEditTags
         * @param {Object} _obj - Tags & Note seelction object
         */
        this.$root.$on('saveEditTags', (_obj) => {
          // Validate Data
          if (_obj && _obj.constructor === {}.constructor &&
            'selection' in _obj && 'note' in _obj &&
            _obj.selection && _obj.selection.constructor === [].constructor &&
            _obj.note && _obj.note.constructor === {}.constructor) {
            if (_obj.selection.length > 0) {
              _obj.selection.forEach((selectionTag) => {
                // Update if any NEW tags
                const tagIndex = context.tags.findIndex(x => x.value === selectionTag.value)
                if (tagIndex < 0) {
                  // A new tag found.
                  context.$root.$emit('updateSqlEntry', {
                    sql: `INSERT INTO tags(id, title, value) VALUES(?,?,?)`,
                    data: [
                      selectionTag.id,
                      selectionTag.title,
                      selectionTag.value
                    ]
                  })
                  // Update tags runtime
                  context.tags.push(selectionTag)
                }
                // Update if any new filter item fot the Tag selection
                const filterIndex = context.filter.findIndex(x => (x.note === _obj.note.id && x.tag === selectionTag.id))
                if (filterIndex < 0) {
                  // Add filter entry
                  context.$root.$emit('updateSqlEntry', {
                    sql: `INSERT INTO filter(note, tag) VALUES(?,?)`,
                    data: [
                      _obj.note.id,
                      selectionTag.id
                    ]
                  })
                  // Update filter runtime
                  context.filter.push({
                    note: _obj.note.id,
                    tag: selectionTag.id
                  })
                }
              })
              // Delete invalid filter entires based on tag selection
              this.deleteInvalidFilters(_obj)
            } else {
              // Selection is emtpy.
              // A note with no tags should be filtered with 'unlisted' tag automatically.
              // Add 'unlisted' filter entry for the selected note.
              const unlistedTagIndex = this.tags.findIndex(x => x.id === 'tag_unlisted')
              if (unlistedTagIndex > -1) {
                this.deleteInvalidFilters({
                  selection: [this.tags[unlistedTagIndex]],
                  note: _obj.note
                })
              }
            }
          }
        })
        /**
         * Filter notes based on tag selection
         * @name filterNotes
         * @param {Array} _obj - Array of tag selection objects
         */
        this.$root.$on('filterNotes', (_obj) => {
          if (_obj && _obj.constructor === [].constructor) {
            if (_obj.length > 0) {
              this.filterList(_obj)
            } else {
              const tagIndex = this.tags.findIndex(x => x.id === 'tag_unlisted')
              this.filterList([this.tags[tagIndex]])
            }
          }
        })
      },
      /**
       * Delete any invalid filter entries based on input tag objects
       * @param {Array} - An object of tag selection and selected note
       */
      deleteInvalidFilters (_obj) {
        const context = this
        const _filter = Object.assign([], context.filter)
        _filter.forEach((filterItem, index) => {
          if (_obj.note.id === filterItem.note) {
            let _delete = true
            _obj.selection.forEach((selectionItem) => {
              if (selectionItem.id === filterItem.tag) {
                _delete = false
              }
            })
            if (_delete) {
              console.log('deleting ...')
              context.$root.$emit('deleteSqlEntryId', {
                sql: `DELETE FROM filter WHERE note='${filterItem.note}' AND tag='${filterItem.tag}'`
              })
              context.filter.splice(index, 1)
            }
          }
        })
      },
      /**
       * On paste action
       */
      onPaste () {
        // Get available formats from electron clipboard
        const formats = clipboard.availableFormats()
        console.log(formats)
        if (isImageFormat(formats)) {
          // Image format detected
          // Create absolute path of image
          const filePath = clipboard.read('public.file-url')
          if (filePath) {
            // Image path is valid
            // Add image type note
            this.addNote({
              type: 'image',
              obj: {
                path: uri2path(filePath),
                format: getImageFormat(formats)
              }
            })
          } else {
            // A screenshot doesn't have absolute path
            // Create nativeImage instance as PNG from clipboard data
            const nativeImageObj = nativeImage.createFromBuffer(clipboard.readImage().toPNG())
            // Add screenshot type note
            this.addNote({
              type: 'screenshot',
              obj: {
                data: nativeImageObj.toDataURL() // Convert to data url
              }
            })
          }
        } else {
          // Clipboard doesn't have image data
          // Get HTML or TEXT data from clipboard
          const htmlData = (clipboard.readHTML() || clipboard.readText())
          if (htmlData) {
            // HTML data detected
            // Add HTML type data.
            // Curretn implementation uses html for both TEXT and HTML data.
            this.addNote({
              type: 'html',
              obj: {
                html: htmlData
              }
            })
          } else {
            // HTML/TEXT data is not detected
            // This is a special scenarion for windows OS.
            // Electron's clipboard doesn't detect Image type.
            if (os.platform() === 'win32') {
              // Get formats from win-clipboard
              const clipboardData = window.winClipboard.getFormats()
              if (clipboardData.indexOf('FileNameW') > -1) {
                // File name is detected.
                // Create absolute path
                const rawPath = new TextDecoder('utf-8').decode(window.winClipboard.getData('FileNameW'))
                let filePath = ''
                rawPath.split('').forEach((letter) => {
                  if (!(letter.charCodeAt(0) === 0)) {
                    filePath += letter
                  }
                })
                if (filePath) {
                  // Path is valid
                  // TODO: check if file is image
                  // Add Image type note
                  this.addNote({
                    type: 'image',
                    obj: {
                      path: filePath,
                      format: getImageFormat(formats)
                    }
                  })
                }
              }
            }
          }
        }
      },
      /**
       * Rest application topbar
       */
      resetTopbar (e) {
        // Reset application topbar ONLY if user click outside search button or serach view.
        if (window.jQuery(e.target).closest('#search-view').length < 1 &&
          window.jQuery(e.target).closest('#topbar-searchview').length < 1) {
          this.$root.$emit('resetTopbar')
        }
      },
      /**
       * Filter notes based on tags selected
       * @param {Array} _obj - Array of tag IDs
       */
      filterList (_obj) {
        if (_obj && _obj.constructor === [].constructor &&
          this.filter && this.filter.constructor === [].constructor &&
          this.briefnote && this.briefnote.constructor === [].constructor &&
          _obj.length > 0 && this.filter.length > 0 && this.briefnote.length > 0) {
          this.list = []
          _obj.forEach((tag) => {
            this.filter.forEach((filterItem) => {
              if (filterItem.tag === tag.id) {
                const index = this.briefnote.findIndex(x => x.id === filterItem.note)
                if (index > -1) {
                  this.list.push(this.briefnote[index])
                }
              }
            })
          })
        }
      }
    },
    /**
     * When application is mounted.
     */
    mounted () {
      // Copy application context
      const context = this
      // Set application to loading until it initializes
      this.onLoading = true
      this.dialogs.genericLoader.state = true
      this.$nextTick(function () {
        // UI is rendered
        // Register events for Home vue component.
        context.registerEvents()
        // Initialize application data
        context.init()
        // Windows based initalizations
        if (os.platform() === 'win32') {
          document.onpaste = function () {
            context.onPaste()
          }
        }
        // Register events Electron's menu button clicks.
        ipcRenderer.on('onMenuItemClick', (event, arg) => {
          if (arg && arg.constructor === {}.constructor && 'label' in arg) {
            switch (arg.label) {
              case 'paste':
                // When user click "Paste" menu button
                context.onPaste()
                break
              case 'find':
                // When user click "Find" menu button
                context.$root.$emit('viewSearch')
                break
              default: break
            }
          }
        })
      })
    }
  }

  /**
   * Check if electron's clipboard format data contains image type.
   * @param {String} - Electron's clipboard raw format string
   * @return {Boolean} - Result
   */
  function isImageFormat (_formats) {
    if (_formats.constructor === [].constructor) {
      for (let index = 0; index < _formats.length; index++) {
        const splitFormats = _formats[index].split('/')
        if (splitFormats.length > 0) {
          if (splitFormats[0] === 'image') {
            return true
          }
        }
      }
    }
    return false
  }

  /**
   * Return format type from electron's clipboard format data
   * @param {String} - Electron's clipboard raw format string
   * @return {String} - Parsed format as string
   */
  function getImageFormat (_formats) {
    if (_formats.constructor === [].constructor) {
      for (let index = 0; index < _formats.length; index++) {
        const splitFormats = _formats[index].split('/')
        if (splitFormats.length > 0) {
          if (splitFormats[0] === 'image') {
            return splitFormats[1]
          }
        }
      }
    }
    return ''
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body {
    font-family: 'Lato', 'Source Sans Pro', sans-serif;
  }
</style>
