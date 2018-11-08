<template>
   <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.new.state">
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
        <v-layout row style="margin-bottom: 20px;">
          <v-menu offset-y
            :nudge-width="100">
            <div slot="activator"
              class="black--text editor-button">
              {{ editor.textSizeLabel }}
            </div>
            <v-card>
              <div class="wrapper text-styles">
                <p text-size-value="normal" text-size-label="Normal Text"
                  class="item" style="font-size: 18px;"
                  @click="textStyleFormat">
                  Normal Text
                </p>
                <p text-size-value="title" text-size-label="Title Text"
                  class="item" style="font-size: 30px"
                  @click="textStyleFormat">
                  Title
                </p>
                <p text-size-value="subtitle" text-size-label="Subtitle Text"
                  class="item" style="font-size: 20px; color: grey"
                  @click="textStyleFormat">
                  Subtitle
                </p>
                <h1 text-size-value="heading1"
                  class="item" text-size-label="Heading 1"
                  @click="textStyleFormat">
                  Heading 1
                </h1>
                <h2 text-size-value="heading2"
                  class="item" text-size-label="Heading 2"
                  @click="textStyleFormat">
                  Heading 2
                </h2>
                <h3 text-size-value="heading3"
                  class="item" text-size-label="Heading 3"
                  @click="textStyleFormat">
                  Heading 3
                </h3>
              </div>
            </v-card>
          </v-menu>
          <v-divider
            class="mx-3"
            inset
            vertical>
          </v-divider>
          <v-spacer></v-spacer>
        </v-layout>
        <p contenteditable="true" class="note-content"
          style="padding: 10px;" id="add-note-text"
          v-html="`<p style='font-size: 18px;'>${source}</p>`">
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
const {
  ipcRenderer
} = require('electron')
const uid = require('uniqid')

export default {
  name: 'add',
  data () {
    return {
      select: [],
      name: '',
      description: '',
      editor: {
        textAlign: null,
        textFormat: null,
        textSizeValue: 'normal',
        textSizeLabel: 'Normal Text'
      },
      loading: false,
      source: ''
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
    textStyleFormat (e) {
      const sizeLable = (e.target.getAttribute('text-size-label'))
      const sizeValue = (e.target.getAttribute('text-size-value'))
      if (sizeLable && sizeValue) {
        this.editor.textSizeLabel = `${sizeLable}`
        this.editor.textSizeValue = `${sizeValue}`
      }
    },
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
        name: 'new',
        state: false
      })
    },
    onClickCheck () {
      console.log('onClickCheck')
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

<style scoped>
  .note-content {
    border-style: solid;
    border-width: 1px;
    border-color: grey;
  }
  .editor-button {
    background: transparent;
    margin: 0 5px;
    margin-top: 8px;
    width: 100px;
  }
  .text-styles > .item {
    background: #FFFFFF;
    padding: 5px;
  }
  .text-styles > .item:hover {
    background: rgba(128, 128, 128, 0.322);
    cursor: pointer;
  }
  .text-styles p, h1, h2, h3 {
    margin: 10px 0;
  }
</style>
