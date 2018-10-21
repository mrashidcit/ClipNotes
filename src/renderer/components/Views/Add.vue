<template>
  <transition name="fade">
    <div class="glass-view"
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
            :disabled="loading"
            @click="onClickCheck">
            <v-icon class="white--text">check</v-icon>
          </v-btn>
        </v-layout>
        <v-text-field box
          v-model="name" ref="name"
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
          :src="`${$store.state.config.add.data.lQuality}`">
        </v-img>
        <v-layout row style="margin-bottom: 20px;"
          v-if="$store.state.config.add.type === 'TEXT' && !loading">
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
        <p v-if="$store.state.config.add.type === 'TEXT' && !loading" contenteditable="true"
          style="padding: 10px;" id="add-note-text"
          v-html="`<p style='font-size: 25px;'>${$store.state.config.add.data}</p>`"></p>
        <v-card flat height="200"
          color="transparent"
          v-if="loading">
          <v-card-text>
            <div class="hero-x-y">
              <v-progress-circular
                indeterminate
                :width="3" :size="50"
                color="primary">
              </v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </transition>
</template>

<script>
const {
  ipcRenderer
} = require('electron')
const fops = require('fs-extra')
const uid = require('uniqid')
const path = require('path')
// const Spawn = require('threads').spawn

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
      },
      loading: false,
      source: null
    }
  },
  computed: {
    onChangeState () {
      return this.$store.state.config.add.state
    }
  },
  watch: {
    onChangeState () {
      if (this.$store.state.config.add.state) {
        const context = this
        this.$nextTick(function () {
          setTimeout(function () {
            context.$refs.name.focus()
          }, 100)
        })
      }
    }
  },
  mounted () {
    const context = this
    ipcRenderer.on('onMenuItemClick', (event, arg) => {
      if (arg && arg.constructor === {}.constructor && 'label' in arg) {
        switch (arg.label) {
          case 'create_note':
            if (context.$store.state.config.add.state) {
              context.onClickCheck()
            }
            break
          default: break
        }
      }
    })
  },
  methods: {
    init () {
      console.log('app:add:init')
    },
    createNoteObject () {
      let object = null
      const config = this.$store.state.config.add
      const _id = uid()
      if (
        config && config.constructor === {}.constructor &&
        'type' in config && config.type
      ) {
        switch (config.type) {
          case 'TEXT':
            object = {
              title: this.name || 'Untitled Note',
              description: this.description || '',
              type: 'TEXT',
              path: `${((this.name).replace(/ /g, '_') || 'Untitled_note_') + '-' + _id}.html`,
              id: _id,
              thumbnail: null
            }
            break
          case 'IMAGE':
            object = {
              title: this.name || 'Untitled Note',
              description: this.description || '',
              type: 'IMAGE',
              path: `${((this.name).replace(/ /g, '_') || 'Untitled_note_') + '-' + _id}`,
              id: _id,
              thumbnail: `.t_${((this.name).replace(/ /g, '_') || 'Untitled_note_') + '-' + _id}`
            }
            break
          default: break
        }
      }
      return object
    },
    clean () {
      this.name = ''
      this.description = ''
      this.select = []
      this.editor.textFormat = null
      this.editor.textAlign = null
    },
    onCloseView () {
      this.clean()
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
      const context = this
      const noteObj = this.createNoteObject()
      if (!noteObj) {
        return
      }
      // Check if data is valid
      let sourceData
      if (noteObj.type === 'TEXT') {
        sourceData = document.getElementById('add-note-text')
          ? document.getElementById('add-note-text').innerHTML
          : null
        if (!sourceData) {
          // Source Data cleared
          return
        }
      } else {
        if (
          !this.$store.state.config.add.data.lQuality ||
          !this.$store.state.config.add.data.hQuality
        ) {
          return
        }
      }
      // Save File
      fops.writeFile(
        path.join(
          context.$store.state.config.resPath,
          noteObj.path
        ),
        noteObj.type === 'TEXT'
          ? sourceData
          : context.$store.state.config.add.data.hQuality,
        function (err) {
          if (err) {
            console.error(err)
          } else {
            // Save if any thumbnail
            if (noteObj.thumbnail) {
              const result = fops.writeFileSync(
                path.join(
                  context.$store.state.config.resPath,
                  noteObj.thumbnail
                ),
                context.$store.state.config.add.data.thumbnail
              )
              console.log('saving thumbnail: ', result)
            }
            // Add Tags
            const newTags = createNewTagsIfAny(
              context.$store.state.notes.tags,
              context.select
            )
            console.log('New Tags: ', newTags)
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
            // Add tags
            if (newTags && newTags.length > 0) {
              newTags.forEach((newTagItem) => {
                context.$root.$emit(
                  'sql',
                  {
                    command: 'ADD',
                    sql: 'INSERT INTO tags(id, title, value) VALUES(?,?,?)',
                    data: [
                      newTagItem.id,
                      newTagItem.title,
                      newTagItem.value
                    ]
                  }
                )
                context.$store.dispatch('addEntry', {
                  entry: 'tags',
                  source: {
                    id: newTagItem.id,
                    title: newTagItem.title,
                    value: newTagItem.value
                  }
                })
              })
            } else {
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
            // Add filter
            // -> Into SQL
            if (newTags && newTags.length > 0) {
              newTags.forEach((newTagItem) => {
                context.$root.$emit(
                  'sql',
                  {
                    command: 'ADD',
                    sql: 'INSERT INTO filter(note, tag) VALUES(?,?)',
                    data: [
                      noteObj.id,
                      newTagItem.id
                    ]
                  }
                )
                context.$store.dispatch('addEntry', {
                  entry: 'filter',
                  source: {
                    note: noteObj.id,
                    tag: newTagItem.id
                  }
                })
              })
            } else {
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
            context.$store.dispatch('setState', {
              name: 'nextPageIndexPlusPlus'
            })
            context.onCloseView()
          }
        }
      )
    }
  }
}

function createNewTagsIfAny (source, select) {
  const newTags = []
  if (
    source && select &&
    source.constructor === [].constructor &&
    select.constructor === [].constructor &&
    select.length > 0
  ) {
    select.forEach((item) => {
      let searchIndex = null
      if (item && item.constructor === {}.constructor) {
        searchIndex = source.findIndex(x => x.title === item.title)
      } else if (item && typeof item === 'string') {
        searchIndex = source.findIndex(x => x.title === item)
      }
      if (searchIndex !== null && searchIndex < 0) {
        newTags.push({
          id: uid(),
          value: item.constructor === {}.constructor
            ? item.title.replace(/ /g, '_')
            : item.replace(/ /g, '_'),
          title: item.constructor === {}.constructor
            ? item.title
            : item
        })
      }
    })
  }
  return newTags
}

/* function threadHandler (input, done) {
  if (input.buffer) {
    const Jimp = this.require('jimp')
    Jimp.read(input.buffer)
      .then(function (image) {
        console.log('on image valid')
      })
      .catch(function (err) {
        console.log('on image not valid')
        done(err)
      })
  } else {
    done(null)
  }
} */
</script>
