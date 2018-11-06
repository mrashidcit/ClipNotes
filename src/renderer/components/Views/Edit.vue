<template>
  <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.edit.state">
      <div class="wrapper hero-x"
        style="width: 600px">
        <v-layout row>
          <h1>{{ $store.state.config.edit.data.title || 'Note Title'}}</h1>
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
          v-model="title" ref="name"
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
import helper from '../../assets/helper.js'

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
            context.updateTags()
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
      console.log('onClickCheck')
    },
    updateTags () {
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

/* function createNewTagsIfAny (source, select) {
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
} */
</script>
