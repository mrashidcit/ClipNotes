<template>
  <v-card flat tile style="margin: 10px;min-height: 250px;"
    @mouseover="onMouseOver" @mouseout="onMouseOut">
    <v-img
      v-if="note.type === 'IMAGE'"
      :src="`${source}`"
      :lazy-src="`${lazySrc}`"
      aspect-ratio="2.85"
    ></v-img>
    <v-card-title primary-title
      v-if="source">
      <div class="text-clamp" single-line>
        <h3 class="headline mb-0">{{note.title}}</h3>
        <div>{{note.description || 'No Description'}}</div>
      </div>
    </v-card-title>
    <v-card-text
      v-if="note.type === 'TEXT' && source"
      class="text-clamp"
      v-html="`${source}`">
    </v-card-text>
    <v-card-actions v-if="source">
      <v-spacer></v-spacer>
      <v-btn icon
        v-if="hoverActions">
        <v-icon class="primary--text">edit</v-icon>
      </v-btn>
      <v-btn icon
        v-if="hoverActions">
        <v-icon class="red--text">delete</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon class="secondary--text">zoom_out_map</v-icon>
      </v-btn>
    </v-card-actions>
    <div class="hero-x-y"
      v-if="!source"
      :load-source="getSource(note)">
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
const fops = require('fs-extra')
const path = require('path')
const Spawn = require('threads').spawn
const lazyImage = require('../assets/lazyImage.js')

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
  methods: {
    onMouseOver () {
      this.hoverActions = true
    },
    onMouseOut () {
      this.hoverActions = false
    },
    getSource (note) {
      console.log('app:page:clipnote;getSource')
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

