<template>
  <div class="state-view"
    v-if="$store.state.config.add.state">
    <div class="wrapper hero-x"
      style="width: 600px">
      <v-layout row>
        <h1>{{ name || `New Note`}}</h1>
        <v-spacer></v-spacer>
        <v-btn icon color="red"
          @click="onCloseView">
          <v-icon class="white--text">clear</v-icon>
        </v-btn>
        <v-btn icon color="primary"
          @click="onClickCheck">
          <v-icon class="white--text">check</v-icon>
        </v-btn>
      </v-layout>
      <v-text-field box
        v-model="name"
        label="Note Name">
      </v-text-field>
      <v-textarea
        v-model="description"
        name="input-description"
        label="Note Description">
      </v-textarea>
      <v-combobox
        v-model="select" box
        item-text="title"
        :items="$store.state.notes.tags"
        label="Select Tags"
        multiple chips>
      </v-combobox>
      <v-img v-if="$store.state.config.add.type === 'IMAGE'"
        src="https://cdn.vuetifyjs.com/images/cards/desert.jpg">
      </v-img>
      <v-layout row style="margin-bottom: 20px;">
        <v-btn-toggle v-model="editor.textAlign">
          <v-btn flat>
            <v-icon>format_align_left</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>format_align_center</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>format_align_right</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>format_align_justify</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="editor.textFormat">
          <v-btn flat>
            <v-icon>format_bold</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>format_italic</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>format_underlined</v-icon>
          </v-btn>
          <v-btn flat>
            <v-icon>format_color_fill</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-layout>
      <p v-if="$store.state.config.add.type === 'TEXT'" contenteditable="true"
        style="padding: 10px;" id="add-note-text"
        v-html="`<p style='font-size: 25px;'>${$store.state.config.add.data}</p>`"></p>
    </div>
  </div>
</template>

<script>
const fops = require('fs-extra')
const uid = require('uniqid')
const path = require('path')

export default {
  name: 'add',
  data () {
    return {
      select: [],
      name: '',
      description: '',
      editor: {
        textAlign: null,
        textFormat: null
      }
    }
  },
  methods: {
    onCloseView () {
      this.$store.dispatch('setState', {
        name: 'add',
        state: false,
        data: null,
        type: null
      })
    },
    onClickCheck () {
      if (!this.$store.state.config.resPath) {
        this.$store.dispatch('setState', {
          name: 'resPath',
          data: require('../../assets/defConfig').refPath
        })
      }
      const _id = uid()
      const context = this
      const noteObj = {
        title: this.name || 'Untitled Note',
        description: this.description || '',
        type: 'TEXT',
        path: `${((this.name).replace(/ /g, '_') || 'Untitled_note_') + '-' + _id + '.html'}`,
        id: _id,
        thumbnail: null
      }
      const sourceData = document.getElementById('add-note-text')
        ? document.getElementById('add-note-text').innerHTML
        : null
      if (!sourceData) {
        // Source Data cleared
        return
      }
      // Save File
      fops.writeFile(
        path.join(
          context.$store.state.config.resPath,
          noteObj.path
        ),
        sourceData,
        function (err) {
          if (err) {
            console.error(err)
          } else {
            // Add note
            // -> Into SQL
            context.$root.$emit(
              'sql',
              {
                command: 'ADD',
                sql: 'INSERT INTO notes(title, description, type, path, id, thumbnail) VALUES(?,?,?,?,?,?)',
                data: [
                  noteObj.title,
                  noteObj.description,
                  noteObj.type,
                  noteObj.path,
                  noteObj.id,
                  noteObj.thumbnail
                ]
              }
            )
            // -> Into Store
            context.$store.dispatch('addEntry', {
              entry: 'notes',
              source: noteObj
            })
            // Add filter
            // -> Into SQL
            context.$root.$emit(
              'sql',
              {
                command: 'ADD',
                sql: 'INSERT INTO filter(note, tag) VALUES(?,?)',
                data: [
                  noteObj.id,
                  'tag_unlisted'
                ]
              }
            )
            // -> Into Store
            context.$store.dispatch('addEntry', {
              entry: 'filter',
              source: {
                note: noteObj.id,
                tag: 'tag_unlisted'
              }
            })
          }
        }
      )
    }
  }
}
</script>
