<template>
  <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.add.state">
      <div class="wrapper hero-x"
        style="width: 600px">
        <v-layout row>
          <h1>{{ name || `Untitled Note`}}</h1>
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
const uid = require('uniqid')
const Spawn = require('threads').spawn

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
        state: false
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
      const tid = new Spawn(thandler)
      tid.send({
        note: noteObj,
        hQuality: noteObj.type === 'IMAGE'
          ? context.$store.state.config.add.data.hQuality
          : null,
        thumbnail: noteObj.type === 'IMAGE'
          ? context.$store.state.config.add.data.thumbnail
          : null,
        resPath: context.$store.state.config.resPath,
        sourceData: noteObj.type === 'TEXT'
          ? sourceData
          : null
      })
      tid.on('message', function (response) {
        if (response.state) {
          console.log('done')
          // Successfully saved Note
          // Add Tags
          const tagObjects = createNewTagsIfAny(
            context.$store.state.notes.tags,
            context.select
          )
          const newTags = tagObjects._newTags
          const oldTags = tagObjects._oldTags
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
          if (context.select.length < 1) {
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
          } else {
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
            }
            if (oldTags && oldTags.length > 0) {
              oldTags.forEach((oldTagItem) => {
                context.$root.$emit(
                  'sql',
                  {
                    command: 'ADD',
                    sql: 'INSERT INTO filter(note, tag) VALUES(?,?)',
                    data: [
                      noteObj.id,
                      oldTagItem.id
                    ]
                  }
                )
                context.$store.dispatch('addEntry', {
                  entry: 'filter',
                  source: {
                    note: noteObj.id,
                    tag: oldTagItem.id
                  }
                })
              })
            }
            context.$store.dispatch('setState', {
              name: 'nextPageIndexPlusPlus'
            })
          }
          context.onCloseView()
        }
        tid.kill()
      })
    }
  }
}

function thandler (input, done) {
  if (
    'title' in input.note && 'description' in input.note &&
    'type' in input.note && 'path' in input.note &&
    'id' in input.note && 'thumbnail' in input.note &&
    input.note.title && input.note.type && input.note.id &&
    input.note.path && 'resPath' in input && input.resPath
  ) {
    const base64Img = this.require('base64-img')
    const path = this.require('path')
    const fops = this.require('fs-extra')
    const filePath = path.join(
      input.resPath,
      input.note.path
    )
    if (input.note.type === 'TEXT') {
      // Save HTML file and done
      if ('sourceData' in input && input.sourceData) {
        fops.writeFile(
          filePath,
          input.sourceData,
          'utf8',
          function (err) {
            if (err) {
              done({
                state: false,
                error: err
              })
            } else {
              done({
                state: true
              })
            }
          }
        )
      }
    } else if (input.note.type === 'IMAGE') {
      if (
        'hQuality' in input &&
        'thumbnail' in input &&
        input.hQuality && input.thumbnail
      ) {
        // Save Image and Thumbnail and done
        const thumbnailPath = path.join(
          input.resPath,
          input.note.thumbnail
        )
        base64Img.img(
          input.hQuality,
          filePath.split(path.basename(filePath))[0],
          path.basename(filePath),
          function (err) {
            if (err) {
              done({
                state: false,
                error: err
              })
            } else {
              base64Img.img(
                input.thumbnail,
                thumbnailPath.split(path.basename(thumbnailPath))[0],
                path.basename(thumbnailPath),
                function (err) {
                  if (err) {
                    done({
                      state: false,
                      error: err
                    })
                  } else {
                    done({
                      state: true
                    })
                  }
                }
              )
            }
          }
        )
      }
    }
  }
}

function createNewTagsIfAny (source, select) {
  const newTags = []
  const oldTags = []
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
      } else {
        if (item && item.constructor === {}.constructor) {
          oldTags.push(item)
        } else if (item && typeof item === 'string') {
          const tagIndex = source.findIndex(x => x.title === item)
          if (tagIndex > -1) {
            oldTags.push(source[tagIndex])
          }
        }
      }
    })
  }
  console.log('old tags', oldTags)
  return {
    _newTags: newTags,
    _oldTags: oldTags
  }
}
</script>
