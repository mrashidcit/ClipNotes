<template>
  <v-card flat tile style="margin: 10px;height: 250px;"
    @mouseover="onMouseOver" @mouseout="onMouseOut">
    <v-img
      v-if="note.type === 'IMAGE'"
      :src="`${source}`"
      :lazy-src="`${lazySrc}`"
      aspect-ratio="3.20"
    ></v-img>
    <v-card-title primary-title
      v-if="source && note.type !== 'BOOKMARK'">
      <div>
        <h3 class="headline mb-0 text-clamp">{{note.title}}</h3>
        <div class="text-clamp" v-if="note.type === 'IMAGE'">{{note.description || 'No Description'}}</div>
      </div>
    </v-card-title>
    <v-card-text
      style="height: 100px;"
      v-if="note.type === 'TEXT' && source"
      class="text-clamp"
      v-html="`${source}`">
    </v-card-text>
    <div v-if="note.type === 'BOOKMARK' && source"
      @click="openUrl"
      v-html="`${source}`">
    </div>
    <v-layout row class="card-actions" v-if="source">
      <v-spacer></v-spacer>
      <v-btn icon
        v-if="hoverActions"
        @click="onClickEdit">
        <v-icon class="primary--text">edit</v-icon>
      </v-btn>
      <v-btn icon
        v-if="hoverActions"
        @click="onClickDelete">
        <v-icon class="red--text">delete</v-icon>
      </v-btn>
      <v-btn icon
        v-if="hoverActions"
        @click="onClickDownload">
        <v-icon class="blue--text">vertical_align_bottom</v-icon>
      </v-btn>
      <v-btn icon
        @click="onViewNote">
        <v-icon class="secondary--text">zoom_out_map</v-icon>
      </v-btn>
      <v-btn icon v-if="note.type === 'BOOKMARK'"
        @click="openUrl">
        <v-icon class="secondary--text">open_in_browser</v-icon>
      </v-btn>
    </v-layout>
    <div class="hero-x-y"
      v-if="!source"
      :load-source="getPath(note)">
      <v-progress-circular
        :size="100"
        :width="4"
        color="primary"
        indeterminate>
      </v-progress-circular>
    </div>
  </v-card>
</template>

<script>
import helper from '../assets/helper'

const fops = require('fs-extra')
const path = require('path')
const Spawn = require('threads').spawn
const normalizeUrl = require('normalize-url')
const lazyImage = require('../assets/lazyImage.js')
const isUrl = require('is-url')

export default {
  name: 'clip-note',
  props: [
    'note'
  ],
  data () {
    return {
      source: '',
      hoverActions: false,
      lazySrc: ''
    }
  },
  mounted () {
    const context = this
    this.$nextTick(function () {
      context.$store.dispatch('incState', {
        name: 'listCount'
      })
    })
  },
  methods: {
    onMouseOver () {
      this.hoverActions = true
    },
    onMouseOut () {
      this.hoverActions = false
    },
    openUrl () {
      if (
        'description' in this.note &&
        'type' in this.note &&
        this.note.type === 'BOOKMARK' &&
        this.note.description
      ) {
        const url = JSON.parse(this.note.description).url
        if (isUrl(url)) {
          this.$electron.shell.openExternal(url)
        }
      }
    },
    onClickDownload () {
      const context = this
      const path = this.$electron.remote.dialog.showSaveDialog(
        this.$electron.remote.getCurrentWindow(),
        {
          filters: [
            {
              name: `${this.note.type === 'IMAGE' ? 'Image' : 'HTML'}`,
              extensions: [`${this.note.type === 'IMAGE' ? 'png' : 'html'}`] }
          ]
        }
      )
      const srcPath = helper.getPathSys(
        this.note,
        this.$store.state.config.resPath,
        this,
        false
      )
      if (path && srcPath && fops.existsSync(srcPath)) {
        fops.copy(
          srcPath,
          path,
          function (err) {
            if (err) {
              context.$store.dispatch('setState', {
                name: 'snackbar',
                state: true,
                message: 'Successfully exported!',
                background: 'red',
                color: 'white--text'
              })
            } else {
              console.log('done')
              context.$store.dispatch('setState', {
                name: 'snackbar',
                state: true,
                message: 'Successfully exported!'
              })
            }
          }
        )
      }
    },
    onClickEdit () {
      this.$store.dispatch('setState', {
        name: 'edit',
        state: true,
        data: Object.assign({}, this.note)
      })
    },
    onClickDelete () {
      const note = Object.assign({}, this.note)
      const context = this
      this.$store.dispatch('setState', {
        name: 'actionDialog',
        state: true,
        title: 'Deleting Clip Note',
        message: `Are you sure about deleting this note "${note.title}"?`,
        pLabel: 'Yes. Delete this note',
        nLabel: 'No',
        pCallback: () => {
          console.log('delete')
          context.$store.dispatch('removeEntry', {
            entry: 'notes',
            source: note
          })
          context.$store.dispatch('setState', {
            name: 'actionDialog',
            state: false
          })
          context.$root.$emit('sql', {
            command: 'DELETE',
            sql: `DELETE FROM notes WHERE id="${note.id}"`
          })
          context.$root.$emit('sql', {
            command: 'DELETE',
            sql: `DELETE FROM filter WHERE note="${note.id}"`
          })
          if (note.type === 'IMAGE') {
            fops.unlink(path.join(
              this.$store.state.config.resPath,
              `${note.thumbnail}.png`
            ))
            fops.unlink(path.join(
              this.$store.state.config.resPath,
              `${note.path}.png`
            ))
          } else {
            fops.unlink(path.join(
              this.$store.state.config.resPath,
              note.path
            ))
          }
        },
        nCallback: () => {
          context.$store.dispatch('setState', {
            name: 'actionDialog',
            state: false
          })
        }
      })
    },
    getPath (note) {
      if (!this.$store.state.config.resPath) {
        this.$store.dispatch('setState', {
          name: 'resPath',
          data: require('../assets/defConfig').refPath
        })
      }
      const context = this
      if (note.type === 'IMAGE') {
        const fileUrl = normalizeUrl(
          'file://' +
          path.join(
            context.$store.state.config.resPath,
            note.thumbnail
          ) + '.png'
        )
        context.source = fileUrl
      } else if (note.type === 'TEXT' || note.type === 'BOOKMARK') {
        fops.readFile(
          path.join(
            this.$store.state.config.resPath,
            note.path
          ),
          'utf8',
          function (err, data) {
            if (err) {
              console.error(err)
            } else {
              context.source = data
            }
          }
        )
      }
    },
    getSource (note) {
      this.lazySrc = lazyImage
      if (
        note && note.constructor === {}.constructor &&
        'type' in note && note.type
      ) {
        const context = this
        let filePath = null
        if (!this.$store.state.config.resPath) {
          this.$store.dispatch('setState', {
            name: 'resPath',
            data: require('../assets/defConfig').refPath
          })
        }
        switch (note.type) {
          case 'TEXT':
            filePath = path.join(
              this.$store.state.config.resPath,
              note.path
            )
            break
          case 'BOOKMARK':
            filePath = path.join(
              this.$store.state.config.resPath,
              note.path
            )
            break
          case 'IMAGE':
            filePath = path.join(
              this.$store.state.config.resPath,
              note.thumbnail
            )
            break
          default: break
        }
        if (filePath && fops.existsSync(filePath)) {
          const tds = new Spawn(threadHandler)
          tds.send({
            path: filePath
          })
          tds.on('message', function (response) {
            if (response) {
              if (note.type === 'IMAGE') {
                // Load async
                context.source = response
              } else {
                context.source = response
              }
              tds.kill()
            }
          })
        }
      }
    },
    onViewNote () {
      this.$store.dispatch('setState', {
        name: 'viewNote',
        state: true,
        data: this.note
      })
    }
  }
}

function threadHandler (input, done) {
  const _fops = this.require('fs-extra')
  _fops.readFile(
    input.path,
    'utf-8',
    function (err, data) {
      if (err) {
        console.error(err)
        done(null)
      } else {
        done(data)
      }
    }
  )
}
</script>
