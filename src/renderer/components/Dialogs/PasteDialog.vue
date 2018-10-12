<template>
  <v-dialog id="id-view-paste" v-model="state"
    fullscreen hide-overlay
    transition="dialog-bottom-transition"
    persistent max-width="600">
    <div class="view-card">
      <div class="hero-x" style="padding: 20px;">
        <div style="width: 500px; height: 300px">
          <h1>
            {{noteName ? noteName : 'New Note'}}
          </h1>
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
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
            aspect-ratio="2.75">
          </v-img>
          <v-card-actions class="width: 100%;">
            <v-spacer></v-spacer>
            <v-btn depressed color="red"
              icon @click="closeDialog">
              <v-icon class="white--text">close</v-icon>
            </v-btn>
            <v-btn depressed color="primary"
              icon>
              <v-icon>check</v-icon>
            </v-btn>
          </v-card-actions>
        </div>
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
    'list'
  ],
  data () {
    return {
      noteName: '',
      noteDescription: '',
      select: []
    }
  },
  methods: {
    closeDialog () {
      // Close the view
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
    }
  }
}
</script>
