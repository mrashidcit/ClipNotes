<template>
  <transition>
    <div class="glass-view"
       v-if="$store.state.config.viewNote.state">
      <div id="note-view-image">
        <transition name="fade">
        <img :src="source" class="hero-x-y fit-image"
          v-if="'type' in $store.state.config.viewNote.data && $store.state.config.viewNote.data.type === 'IMAGE' && ready">
        </transition>
      </div>
      <div class="hero-x fit-text"
        v-if="'type' in $store.state.config.viewNote.data && $store.state.config.viewNote.data.type === 'TEXT' && ready"
        v-html="source"></div>
      <v-toolbar fixed color="transparent" flat>
        <v-toolbar-title style="background: white;padding: 10px 20px;">
          {{$store.state.config.viewNote.data.title}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon color="white"
            @click="onClickDelete">
            <v-icon class="red--text">delete</v-icon>
          </v-btn>
          <v-btn icon color="white"
            @click="onClickEdit">
            <v-icon class="black--text">edit</v-icon>
          </v-btn>
          <v-btn icon :color="info ? 'primary' : 'white'"
            @click="info = !info">
            <v-icon :class="info ? 'white--text' : 'black--text'">subject</v-icon>
          </v-btn>
          <v-btn icon color="black"
            @click="closeNoteView">
            <v-icon class="white--text">close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div id="note-view-info"
        v-if="info">
        <div class="wrapper">
          <div class="info-title">
            <v-btn small icon flat
              class="item" style="padding: -1px 0;">
              <v-icon class="black--text">close</v-icon>
            </v-btn>
            <h1 class="item">
              {{$store.state.config.viewNote.data.title}}
            </h1>
          </div>
          <p style="font-size: 18px; color: grey; min-height: 50px;">
            {{$store.state.config.viewNote.data.description || 'No Description'}}
          </p>
          <h4>
            Tags Assiciated
          </h4>
          <div class="tags">
            <tags v-for="(item, index) in tagsAssociated"
              :key="index"
              :tag="item" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import helper from '../../assets/helper.js'
import Tags from './Tags'

const path = require('path')
const fops = require('fs-extra')

export default {
  name: 'view-note',
  components: {
    Tags
  },
  data () {
    return {
      source: null,
      ready: false,
      tagsAssociated: [],
      info: false
    }
  },
  computed: {
    viewNoteState: function () {
      return this.$store.state.config.viewNote.state
    }
  },
  watch: {
    viewNoteState: function (state) {
      if (state) {
        this.tagsAssociated = helper.getTagsFromNote(
          this.$store.state.config.viewNote.data,
          this.$store.state.notes.filter,
          this.$store.state.notes.tags
        )
        this.loadSource()
      }
    }
  },
  methods: {
    loadSource: function () {
      const src = helper.getPath(
        this.$store.state.config.viewNote.data,
        this.$store.state.config.resPath,
        this,
        true
      )
      this.source = src
      this.ready = true
    },
    closeNoteView () {
      this.$store.dispatch('setState', {
        name: 'viewNote',
        state: false
      })
      this.source = null
      this.ready = false
      this.info = false
    },
    onClickEdit: function () {
      this.$store.dispatch('setState', {
        name: 'edit',
        state: true,
        data: this.$store.state.config.viewNote.data
      })
    },
    onClickDelete: function () {
      const note = Object.assign({}, this.$store.state.config.viewNote.data)
      const context = this
      this.$store.dispatch('setState', {
        name: 'actionDialog',
        state: true,
        title: 'Deleting Clip Note',
        message: `Are you sure about deleting this note "${note.title}"?`,
        pLabel: 'Yes. Delete this note',
        nLabel: 'No',
        pCallback: () => {
          console.log('delete')
          context.$store.dispatch('removeEntry', {
            entry: 'notes',
            source: note
          })
          context.$store.dispatch('setState', {
            name: 'actionDialog',
            state: false
          })
          context.$root.$emit('sql', {
            command: 'DELETE',
            sql: `DELETE FROM notes WHERE id="${note.id}"`
          })
          context.$root.$emit('sql', {
            command: 'DELETE',
            sql: `DELETE FROM filter WHERE note="${note.id}"`
          })
          if (note.type === 'IMAGE') {
            fops.unlink(path.join(
              this.$store.state.config.resPath,
              `${note.thumbnail}.png`
            ))
            fops.unlink(path.join(
              this.$store.state.config.resPath,
              `${note.path}.png`
            ))
          } else {
            fops.unlink(path.join(
              this.$store.state.config.resPath,
              note.path
            ))
          }
        },
        nCallback: () => {
          context.$store.dispatch('setState', {
            name: 'actionDialog',
            state: false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  #note-view-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .fit-image {
    width: auto;
    height: 90%;
  }
  .fit-text {
    background: #FFFFFF;
    padding: 20px;
    margin-top: 70px;
    width: 70% !important;
  }
  #note-view-info {
    position: fixed;
    bottom: 0;
    left: 10px;
    right: 0px;
    height: 300px;
    background: rgb(255, 255, 255);
    box-shadow: 1px 1px 8px #888888;
  }
  #note-view-info .tags {
    margin: 10px 0;
  }
  #note-view-info .info-title {
    line-height: 50px;
  }
  .info-title > .item {
    display: inline-block;
    vertical-align: middle;
  }
</style>
