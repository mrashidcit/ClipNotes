<template>
  <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.manageTags.state">
      <div class="wrapper hero-x"
        style="width: 600px">
        <v-layout row>
          <div>
            <h1>Manage Tags</h1>
            <p><strong>Add</strong> or <strong>Remove</strong> tags from clipnotes.</p>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon color="red"
            style="margin: 17px 0;"
            @click="onCloseView">
            <v-icon class="white--text">clear</v-icon>
          </v-btn>
        </v-layout>
        <v-text-field append-icon="search"
          solo placeholder="Search Tags">
        </v-text-field>
        <div class="tag-management-view"
          v-if="$store.state.notes.tags.length > 0">
          <tags v-for="item in tags"
            :key="item.id"
            :tag="item"
            :closable="true"
            :delegateId="id"/>
        </div>
        <div v-if="$store.state.notes.tags.length < 1"
          style="text-align: center;">
          <h2 class="grey--text">Your tag list is empty :(</h2>  
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Tags from './Tags'

const uid = require('uniqid')

export default {
  components: {
    Tags
  },
  data () {
    return {
      tags: [],
      id: uid()
    }
  },
  computed: {
    onViewManageTags: function () {
      return this.$store.state.config.manageTags.state
    }
  },
  watch: {
    onViewManageTags: function (state) {
      if (state) {
        this.$store.state.notes.tags.forEach((tag) => {
          this.tags.push({
            delete: false,
            id: tag.id,
            title: tag.title,
            value: tag.value
          })
        })
      } else {
        this.tags = []
      }
    }
  },
  mounted () {
    const context = this
    this.$root.$on(`${this.id}`, function (config) {
      if ('id' in config && config.id) {
        const targetIndex = context.tags.findIndex(x => x.id === config.id)
        if (targetIndex > -1) {
          context.tags[targetIndex].delete = true
        }
      }
    })
  },
  methods: {
    onCloseView: function () {
      const context = this
      this.tags.forEach((tag) => {
        if (tag.delete) {
          // Delete from store
          context.$store.dispatch('removeEntry', {
            entry: 'tags',
            source: tag
          })
          // Delete from database
          context.$root.$emit('sql', {
            command: 'DELETE',
            sql: `DELETE from tags WHERE id="${tag.id}"`
          })
        }
      })
      this.$store.dispatch('setState', {
        name: 'manageTags',
        state: false
      })
    }
  }
}
</script>

<style scoped>
  .tag-management-view {
    position: relative;
    width: 100%;
    height: 70vh;
    background: transparent;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
