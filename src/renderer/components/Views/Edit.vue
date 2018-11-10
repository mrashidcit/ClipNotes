<template>
  <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.edit.state">
      <div class="wrapper hero-x"
        style="width: 600px">
        <v-layout row>
          <h1>{{
            ( $store.state.config.edit.data.constructor === {}.constructor &&
              'description' in $store.state.config.edit.data && (description = $store.state.config.edit.data.description) &&
              'title' in $store.state.config.edit.data && (name = $store.state.config.edit.data.title)
            ) ||
            `Untitled Note`}}
          </h1>
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
        <div class="important-info-box" style="width: 100%;"
          v-if="$store.state.config.edit.data.type === 'BOOKMARK'">
          You can only edit Tags assicated with a bookmark.
          Title and Description are fetched ONLY at the time of creating bookmark.
        </div>
        <v-text-field box
          :disabled="$store.state.config.edit.data.type === 'BOOKMARK'"
          v-model="title" ref="name"
          label="Note Name">
        </v-text-field>
        <v-textarea
          :disabled="$store.state.config.edit.data.type === 'BOOKMARK'"
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
        <v-card flat style="min-height: 250px;height: 300px;"
          v-if="$store.state.config.edit.data.type === 'BOOKMARK'">
          <div v-html="source">
          </div>
        </v-card>
        <transition name="fade">
          <v-img v-if="type === 'IMAGE' && ready"
            :src="source" style="width: auto; height: 100%">
          </v-img>
        </transition>
        <v-layout row style="margin-bottom: 20px;"
          v-if="type === 'TEXT' && ready">
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
        <p v-if="type === 'TEXT' && !loading" contenteditable="true"
          style="padding: 10px;" id="add-note-text"
          v-html="`<p style='font-size: 25px;'>${source}</p>`"></p>
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
import helper from '../../assets/helper.js'

const uid = require('uniqid')

export default {
  name: 'edit',
  data () {
    return {
      select: [],
      title: '',
      description: '',
      type: '',
      ready: false,
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
      return this.$store.state.config.edit.state
    }
  },
  watch: {
    onChangeState (state) {
      if (state) {
        const context = this
        this.$nextTick(function () {
          setTimeout(function () {
            context.$refs.name.focus()
            context.title =
              context.$store.state.config.edit.data.title
            context.description =
              context.$store.state.config.edit.data.description
            context.updateView()
          }, 100)
        })
      }
    }
  },
  methods: {
    clean () {
      this.name = ''
      this.description = ''
      this.select = []
      this.editor.textFormat = null
      this.editor.textAlign = null
      this.ready = false
    },
    onCloseView () {
      this.clean()
      this.$store.dispatch('setState', {
        name: 'edit',
        state: false
      })
    },
    onClickCheck () {
      const context = this
      if (
        this.title
      ) {
        if (context.select.length < 1) {
          context.select.push('unlisted')
        }
        const note = context.$store.state.config.edit.data
        const selection = createNewTagsIfAny(
          this.$store.state.notes.tags,
          this.select
        )
        // TAGS
        const tags = Object.assign([], this.$store.state.notes.tags)
        selection._newTags.forEach((newTag) => {
          let targetIndex = tags.findIndex(x => x.id === newTag.id)
          if (targetIndex < 0) {
            // update tags in store
            context.$store.dispatch('addEntry', {
              entry: 'tags',
              source: newTag
            })
            // update tags in database
            context.$root.$emit('sql', {
              command: 'ADD',
              sql: `INSERT INTO tags(id, title, value) VALUES(?,?,?)`,
              data: [newTag.id, newTag.title, newTag.value]
            })
          }
        })
        // Filter
        const filter = Object.assign([], this.$store.state.notes.filter)
        // Filter: new tags
        selection._newTags.forEach((newTag) => {
          const targetIndex = filter.findIndex(x => (x.note === note.id && x.tag === newTag.id))
          if (targetIndex < 0) {
            // Update filter in store
            context.$store.dispatch('addEntry', {
              entry: 'filter',
              source: {
                note: note.id,
                tag: newTag.id
              }
            })
            // Update filter in databse
            context.$root.$emit('sql', {
              command: 'ADD',
              sql: `INSERT INTO filter(note,tag) VALUES(?,?)`,
              data: [note.id, newTag.id]
            })
          }
        })
        // Filter: old tags
        selection._oldTags.forEach((oldTag) => {
          const targetIndex = filter.findIndex(x => (x.note === note.id && x.tag === oldTag.id))
          if (targetIndex < 0) {
            // Update filter in store
            context.$store.dispatch('addEntry', {
              entry: 'filter',
              source: {
                note: note.id,
                tag: oldTag.id
              }
            })
            // Update filter in databse
            context.$root.$emit('sql', {
              command: 'ADD',
              sql: `INSERT INTO filter(note,tag) VALUES(?,?)`,
              data: [note.id, oldTag.id]
            })
          }
        })
        // Remove unnecessry filter entries
        filter.forEach((filterItem) => {
          if (filterItem.note === note.id) {
            let rFlag = true
            for (let index = 0; index < context.select.length; index++) {
              if (
                context.select[index] &&
                context.select[index].constructor === {}.constructor &&
                context.select[index].id === filterItem.tag
              ) {
                rFlag = false
                break
              } else if (
                context.select[index] &&
                typeof context.select[index] === 'string'
              ) {
                const tagId = helper.getTagIdFromValue(
                  context.select[index],
                  context.$store.state.notes.tags
                )
                if (tagId && tagId === filterItem.tag) {
                  rFlag = false
                  break
                }
              }
            }
            if (rFlag) {
              // Remove from store
              context.$store.dispatch('removeEntry', {
                entry: 'filter',
                source: filterItem
              })
              // Remove from sql
              context.$root.$emit('sql', {
                command: 'DELETE',
                sql: `DELETE FROM filter WHERE note="${filterItem.note}" AND tag="${filterItem.tag}"`
              })
            }
          }
        })
        // Note
        // Note: update store
        this.$store.dispatch('updateEntry', {
          entry: 'notes',
          source: {
            id: note.id,
            title: this.title,
            description: this.description
          }
        })
        // Note: update database
        this.$root.$emit('sql', {
          command: 'UPDATE',
          sql: `UPDATE notes set title="${this.title}", description="${this.description}" WHERE id="${note.id}"`
        })
        this.$store.dispatch('setState', {
          name: 'edit',
          state: false
        })
      } else {
        // Title is required for editing notes.
        const title = this.$store.state.config.edit.data.title
        this.$store.dispatch('setState', {
          name: 'actionDialog',
          state: true,
          title: 'Untitle Note',
          message:
            `Note title shouldn't be empty. Do you want to use previous title "${title}"?`,
          pCallback: function () {
            context.title = title
            context.$store.dispatch('setState', {
              name: 'actionDialog',
              state: false
            })
          },
          nLabel: 'I will provide new title',
          nCallback: function () {
            context.$store.dispatch('setState', {
              name: 'actionDialog',
              state: false
            })
          }
        })
      }
    },
    updateView () {
      const tagsAssciated = helper.getTagsFromNote(
        this.$store.state.config.edit.data,
        this.$store.state.notes.filter,
        this.$store.state.notes.tags
      )
      this.type = this.$store.state.config.edit.data.type
      this.select = Object.assign([], tagsAssciated)
      this.source = helper.getPath(
        this.$store.state.config.edit.data,
        this.$store.state.config.resPath,
        this,
        true
      )
      this.ready = true
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
  return {
    _newTags: newTags,
    _oldTags: oldTags
  }
}
</script>
