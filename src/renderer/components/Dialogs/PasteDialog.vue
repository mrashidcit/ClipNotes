<template>
  <v-dialog id="id-view-paste" v-model="state"
    fullscreen hide-overlay
    transition="dialog-bottom-transition"
    persistent max-width="600">
    <div class="view-card">
      <div class="hero-x" style="padding: 20px;" v-if="!loader">
        <div style="width: 500px; height: 300px">
          <v-layout row>
            <h1>
              {{noteName ? noteName : 'Untitled Note'}}
            </h1>
            <v-spacer></v-spacer>
            <v-btn depressed color="red"
              icon @click="closeDialog">
              <v-icon class="white--text">close</v-icon>
            </v-btn>
            <v-btn depressed color="primary"
              :disabled="!$store.state.PasteImage.source"
              icon @click="addNote">
              <v-icon>check</v-icon>
            </v-btn>
          </v-layout>
          <v-text-field box
            v-model="noteName"
            label="Note Name">
          </v-text-field>
          <v-combobox
            v-model="select"
            :items="tags"
            label="Select Tags"
            item-text="title"
            multiple
            @keyup.enter="addTag"
            chips box>
            <template
              slot="selection"
              slot-scope="data">
              <v-chip
                :key="`${data.item.id}`"
                class="v-chip--select-multi">
                {{ data.item.title }}
              </v-chip>
            </template>
          </v-combobox>
          <v-textarea box
            v-model="noteDescription"
            placeholder="Note Description">
          </v-textarea>
          <v-img v-if="note && $store.state.PasteImage.source && note.type === 'image'"
            :src="$store.state.PasteImage.source"
            aspect-ratio="1.75">
          </v-img>
          <p style="text-align: center;"
            v-if="!$store.state.PasteImage.source">
            Loading Image
          </p>
        </div>
      </div>
      <div class="hero" v-else>
        <h1>Creating Note ...</h1>
      </div>
    </div>
  </v-dialog>
</template>

<script>
const uniqid = require('uniqid')

export default {
  name: 'paste-dialog',
  props: [
    'state',
    'tags',
    'list',
    'config',
    'note'
  ],
  data () {
    return {
      noteName: '',
      noteDescription: '',
      select: [],
      loader: false
    }
  },
  methods: {
    closeDialog () {
      this.cleanUp()
      this.$root.$emit('closeDialog', {
        name: 'paste'
      })
    },
    addNote () {
      this.loader = true
      this.$root.$emit('addNote', {
        type: this.note.type,
        obj: this.note.obj,
        _obj: {
          name: this.noteName,
          description: this.noteDescription,
          tags: this.select
        }
      })
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
    registerEvents () {
      this.$root.$on('onSaveNote', () => {
        this.closeDialog()
      })
    },
    cleanUp () {
      this.noteName = ''
      this.noteDescription = ''
      this.select = []
      this.loader = false
      this.$store.dispatch('clearSource')
    }
  },
  mounted () {
    this.registerEvents()
  }
}
</script>
