<template>
  <v-dialog id="id-new-note" v-model="state"
    fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card class="view-card" flat>
      <div class="menu wrapper">
        <v-layout row color="transparent">
          <h1 style="padding: 5px;width: 500px;overflow-x: auto;white-space: nowrap;" v-html="title" contenteditable="true"></h1>
          <v-spacer></v-spacer>
          <v-btn depressed color="secondary">
            Cancel
          </v-btn>
          <v-btn depressed color="primary">
            Save
          </v-btn>
        </v-layout>
      </div>
      <div class="note-content hero-x"
        contenteditable="true"
        @click="clearPlaceholder"
        @change="onEditNote"
        v-html="readme">
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
const markdown = require('markdown').markdown

export default {
  name: 'new-note',
  props: ['state'],
  data () {
    return {
      title: 'Create New Note',
      readme: `${markdown.toHTML('#Hello **world**!')}`,
      editContent: false
    }
  },
  computed: {
    onReadmeChange () {
      return this.readme
    }
  },
  watch: {
    onReadmeChange () {
      console.log(this.readme)
    }
  },
  methods: {
    clearPlaceholder () {
      if (!this.editContent) {
        this.editContent = true
        this.readme = ``
      }
    },
    onEditNote () {
      console.log('here')
      if (!this.readme) {
        this.readme = `Click here to get started`
      }
    }
  }
}
</script>

<style scoped>
  .view-card {
    background-color: rgba(255, 255, 255, 0.7);
    height: auto;
  }
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background: transparent;
  }
  .note-content {
    padding-top: 100px;
    width: 80%;
  }
</style>
