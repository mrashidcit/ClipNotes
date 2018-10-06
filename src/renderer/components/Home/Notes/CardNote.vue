<template>
  <v-card flat tile height="250px" color="white"
    :class="`elevation-${elevation.value}`"
    @mouseover="onMouseOver(briefnote)"
    @mouseout="onMouseOut(briefnote)"
    style="cursor: pointer;">
    <!-- Note Type: Image -->
    <v-img
      v-if="briefnote.type === 'image' && 'visible' in briefnote && briefnote.visible === true"
      height="250px"
      :src="value" :load-data="!value && getAbsolutePath(briefnote.path)">
      <v-container fill-height fluid>
        <v-layout fill-height>
          <v-flex xs12 align-end flexbox>
            <p class="headline card-image-info">{{briefnote.title}}</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-img>
    <!-- Note Type: TEXT or HTML -->
    <!-- Title -->
    <v-card-title
      v-else-if="
        (briefnote.type === 'text' || briefnote.type === 'html') &&
        'visible' in briefnote && briefnote.visible === true">
      <div class="headline">{{briefnote.title}}</div>
    </v-card-title>
    <!-- Text/HTML -->
    <v-card-text class="htmlContent" v-if="briefnote.type === 'html' && 'visible' in briefnote && briefnote.visible === true" v-html="value" :load-data="getHtmlStr(briefnote.path)"></v-card-text>
    <!-- Note options -->
    <div class="options" v-if="onHover">
      <v-layout row>
        <v-btn icon raised color="white"
          @click="openNote">
          <v-icon class="black--text">zoom_out_map</v-icon>
        </v-btn>
        <v-btn icon raised color="white"
          @click="onEditInfo">
          <v-icon class="orange--text">edit</v-icon>
        </v-btn>
        <v-btn icon raised color="white"
          @click="onEditTags">
          <v-icon class="primary--text">local_offer</v-icon>
        </v-btn>
        <v-btn icon raised color="white">
          <v-icon class="red--text">delete</v-icon>
        </v-btn>
      </v-layout>
    </div>
    <!-- Loader view -->
    <v-card-text class="hero" v-if="!ready">
      Loading
      <v-progress-linear
        indeterminate
        color="black"
        class="mb-0"
      ></v-progress-linear>
    </v-card-text>
    <!-- Edit tags -->
    <div class="edit"
      v-if="edit.tags || edit.info">
      <div class="wrapper" v-if="edit.tags">
        <h3 class="grey--text">Select Tags</h3>
        <v-combobox
          v-model="select"
          :items="tags"
          label="Select Tags"
          item-text="title"
          multiple
          @keyup.enter="addTag"
          chips solo>
          <template
            slot="selection"
            slot-scope="data">
            <v-chip
              :key="`${data.item.id}`"
              v-if="data.item.title"
              class="v-chip--select-multi">
              {{ data.item.title }}
            </v-chip>
          </template>
        </v-combobox>
        <v-layout row>
          <v-spacer></v-spacer>
          <v-btn depressed color="grey"
            @click="closeEditTags"
            class="white--text">
            Cancel
          </v-btn>
          <v-btn depressed color="primary"
            @click="onSaveEditTags">
            Save
          </v-btn>
        </v-layout>
      </div>
      <div class="wrapper" v-if="edit.info">
        <v-text-field solo flat
          placeholder="Note Title"
          :value="briefnote.title">
        </v-text-field>
        <v-textarea solo flat small
          height="80px" min-height="80px"
          :value="briefnote.description"
          placeholder="Note Description">
        </v-textarea>
        <v-layout row>
          <v-spacer></v-spacer>
          <v-btn depressed color="grey"
            @click="closeEditInfo"
            class="white--text">
            Cancel
          </v-btn>
          <v-btn depressed color="primary">
            Save
          </v-btn>
        </v-layout>
      </div>
    </div>
  </v-card>
</template>

<script>
// import { nativeImage } from 'electron'

const os = require('os')
const path = require('path')
const fops = require('fs-extra')
const uniqid = require('uniqid')

export default {
  name: 'card-note',
  props: [
    'briefnote',
    'config',
    'tags',
    'filter'
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
      value: '',
      select: [],
      selectPrev: [],
      edit: {
        tags: false,
        info: false
      }
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
    loadImage (_path) {
      if (_path && this.config &&
        'appPath' in this.config && this.config.appPath) {
        const srcPath = path.join(
          this.config.appPath,
          _path
        )
        if (fops.existsSync(srcPath)) {
          console.log(srcPath)
        }
      }
    },
    openNote () {
      const note = this.briefnote
      if (note && 'id' in note && 'path' in note &&
        'title' in note && 'type' in note) {
        this.$root.$emit('viewNote', note)
      }
    },
    onEditTags () {
      if (!this.edit.tags) {
        if (this.briefnote && this.briefnote.constructor === {}.constructor &&
          this.filter && this.filter.constructor === [].constructor &&
          this.tags && this.tags.constructor === [].constructor &&
          this.filter.length > 0 && this.tags.length > 0 &&
          'id' in this.briefnote && this.briefnote.id) {
          this.filter.forEach((filterItem) => {
            if (filterItem.note === this.briefnote.id) {
              const tagIndex = this.tags.findIndex(x => x.id === filterItem.tag)
              if (tagIndex > -1) {
                this.select.push(this.tags[tagIndex])
              }
            }
          })
        }
        this.edit.tags = true
        this.selectPrev = Object.assign([], this.select)
      }
    },
    addTag () {
      if (this.select && this.select.constructor === [].constructor &&
        this.tags && this.tags.constructor === [].constructor &&
        this.select.length > 0) {
        const eIndex = this.select.length - 1
        const newTagName = (`${this.select[eIndex]}`).toLowerCase()
        const tagIndex = this.tags.length > 0
          ? this.tags.findIndex(x => x.title === newTagName)
          : -1
        this.select.splice(eIndex, 1)
        if (newTagName && tagIndex < 0) {
          this.select.push({
            id: uniqid(),
            title: newTagName,
            value: `tag_${newTagName}`
          })
        } else {
          this.select.push(this.tags[tagIndex])
        }
      }
    },
    onSaveEditTags () {
      if (this.select && this.select.constructor === [].constructor &&
        this.tags && this.tags.constructor === [].constructor &&
        this.briefnote && this.briefnote.constructor === {}.constructor) {
        if (!arraysEqual(this.select, this.selectPrev)) {
          this.$root.$emit('saveEditTags', {
            selection: this.select,
            note: this.briefnote
          })
        }
        this.select = []
        this.selectPrev = []
        this.edit.tags = false
      }
    },
    onEditInfo () {
      if (!this.edit.info) {
        this.edit.info = true
      }
    },
    closeEditTags () {
      if (this.edit.tags) {
        this.select = []
        this.edit.tags = false
      }
    },
    closeEditInfo () {
      if (this.edit.info) {
        this.edit.info = false
      }
    }
  }
}

/**
 * Check if arrays are equal
 * @param {Array} _a1 - Array One
 * @param {Array} _a2 - Array Two
 * @return {Boolean}
 */
function arraysEqual (_a1, _a2) {
  if (_a1 === _a2) return true
  if (_a1 === null || _a2 === null) return false
  if (_a1.length !== _a2.length) return false

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < _a1.length; ++i) {
    if (_a1[i] !== _a2[i]) return false
  }
  return true
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
  .edit {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    overflow-y: auto;
    background: white;
  }
</style>
