<template>
  <v-card flat tile height="250px" color="white"
    :class="`elevation-${elevation.value}`"
    @mouseover="onMouseOver(briefnote)"
    @mouseout="onMouseOut(briefnote)"
    style="cursor: pointer;">
    <v-img
      v-if="briefnote.type === 'image' && 'visible' in briefnote && briefnote.visible === true"
      height="250px"
      :src="value" :load-data="getAbsolutePath(briefnote.path)">
      <v-container fill-height fluid>
        <v-layout fill-height>
          <v-flex xs12 align-end flexbox>
            <p class="headline card-image-info">{{briefnote.title}}</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-img>
    <v-card-title v-else-if="(briefnote.type === 'text' || briefnote.type === 'html') && 'visible' in briefnote && briefnote.visible === true">
      <div class="headline">{{briefnote.title}}</div>
    </v-card-title>
    <v-card-text class="htmlContent" v-if="briefnote.type === 'html' && 'visible' in briefnote && briefnote.visible === true" v-html="value" :load-data="getHtmlStr(briefnote.path)"></v-card-text>
    <div class="options" v-if="onHover">
      <v-layout row>
        <v-btn icon raised color="white"
          @click="openNote">
          <v-icon class="black--text">zoom_out_map</v-icon>
        </v-btn>
        <v-btn icon raised color="white">
          <v-icon class="black--text">edit</v-icon>
        </v-btn>
        <v-btn icon raised color="white">
          <v-icon class="black--text">more_horiz</v-icon>
        </v-btn>
      </v-layout>
    </div>
    <v-card-text class="hero" v-if="!ready">
      Loading
      <v-progress-linear
        indeterminate
        color="black"
        class="mb-0"
      ></v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script>
const os = require('os')
const path = require('path')
const fops = require('fs-extra')

export default {
  name: 'card-note',
  props: [
    'briefnote'
  ],
  data () {
    return {
      onHover: false,
      dummyDescription: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      dummyTitle: `What is Lorem Ipsum?`,
      dummyHtml: `<h1>hello</h1> <h1>hello</h1> <h1>hello</h1><h1>hello</h1><h1>hello</h1>`,
      elevation: {
        value: 0
      },
      ready: false,
      value: ''
    }
  },
  methods: {
    onMouseOver (_item) {
      this.onHover = true
      this.elevation.value = 10
    },
    onMouseOut (_item) {
      this.onHover = false
      this.elevation.value = 0
    },
    getHtmlStr (_path) {
      const context = this
      if (_path) {
        const srcPath = path.join(
          os.homedir(),
          '.xplorebits',
          'briefnote',
          _path
        )
        // Check if path exists
        if (fops.existsSync(srcPath)) {
          fops.readFile(srcPath, 'utf8', (err, data) => {
            if (err) {
              console.error(err)
            } else {
              setTimeout(() => {
                context.value = data
                context.ready = true
              }, 500)
            }
          })
        }
      }
    },
    getAbsolutePath (_path) {
      const context = this
      if (_path) {
        const srcPath = path.join(
          os.homedir(),
          '.xplorebits',
          'briefnote',
          _path
        )
        if (fops.existsSync(srcPath)) {
          setTimeout(() => {
            context.ready = true
            context.value = `file://${srcPath}`
          }, 500)
        }
      }
    },
    openNote () {
      const note = this.briefnote
      if (note && 'id' in note && 'path' in note &&
        'title' in note && 'type' in note) {
        this.$root.$emit('viewNote', note)
      }
    }
  }
}
</script>

<style scoped>
  .options {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 5px;
  }
  .card-image-info {
    background-color: rgba(255, 255, 255, 0.7);
    color: black;
    padding: 5px;
  }
  .htmlContent {
    overflow: hidden;
    height: 140px;
  }
</style>
