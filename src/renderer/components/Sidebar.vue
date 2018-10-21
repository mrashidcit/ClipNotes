<template>
  <div id="app-sidebar">
    <div class="sidebar-title">
      <img class="logo" src="../assets/logo-hero.png">
      <div class="options">
        <v-menu
          offset-y>
          <v-btn icon small 
            flat slot="activator">
            <v-icon class="grey--text">more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(item, index) in more"
              :key="index" @click="item.callback">
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="sidebar-info">
      <v-subheader>Total Filtered Notes</v-subheader>
      <p class="filter-count">
        {{$store.state.notes.selected.length > 0
          ? $store.state.notes.selected.length
          : $store.state.notes.notes.length}}
      </p>
      <v-switch class="wrapper" small
      :label="`Hard Filter: ${hardFilter ? 'ON' : 'OFF'}`"
      v-model="hardFilter">
      </v-switch>
    </div>
    <v-subheader>Filter Notes with Tags</v-subheader>
    <div class="sidebar-tags">
      <v-combobox
        v-model="select" ref="sidebarFilter"
        :items="$store.state.notes.tags" solo flat
        item-text="title" @change="onChangeFilter"
        label="Select Tags"
        multiple chips>
      </v-combobox>
    </div>
  </div>
</template>

<script>
const {
  ipcRenderer
} = require('electron')

export default {
  name: 'sidebar',
  data () {
    return {
      hardFilter: false,
      select: [],
      tags: [
        'hello',
        'test'
      ],
      more: [
        {
          title: 'About',
          callback: () => {
            console.log('on Click about')
            // On Click About
            this.$store.dispatch('setState', {
              name: 'about',
              state: true
            })
          }
        }
      ]
    }
  },
  mounted () {
    const context = this
    ipcRenderer.on('onMenuItemClick', (event, arg) => {
      if (arg && arg.constructor === {}.constructor && 'label' in arg) {
        switch (arg.label) {
          case 'filter':
            context.$refs.sidebarFilter.focus()
            break
          default: break
        }
      }
    })
  },
  methods: {
    onChangeFilter () {
      if (
        this.select &&
        this.select.constructor === [].constructor &&
        this.select.length > 0
      ) {
        const context = this
        context.$store.dispatch('clearEntries', {
          entry: 'selected',
          source: null
        })
        setTimeout(() => {
          if (this.$store.state.notes.selected.length < 1) {
            if (this.$store.state.notes.filter.length > 0) {
              this.select.forEach((selection) => {
                if (selection) {
                  // Get Tag Id of selected tag
                  console.log(selection)
                  let tagIndex = null
                  if (selection && selection.constructor === {}.constructor) {
                    tagIndex = context.$store.state.notes.tags
                      .findIndex(x => x.title === selection.title)
                  } else if (selection && typeof selection === 'string') {
                    tagIndex = context.$store.state.notes.tags
                      .findIndex(x => x.title === selection)
                  }
                  if (tagIndex !== null && tagIndex > -1) {
                    console.log(context.$store.state.notes.tags[tagIndex].title)
                    const tagId = context.$store.state.notes.tags[tagIndex].id
                    const filter = context.$store.state.notes.filter
                    if (filter.constructor === [].constructor) {
                      filter.forEach((filterItem) => {
                        if (filterItem.tag === tagId) {
                          if (
                            context.$store.state.notes.selected
                              .findIndex(x => x.id === filterItem.note) < 0
                          ) {
                            const noteId = filterItem.note
                            const noteIndex = context.$store.state.notes.notes
                              .findIndex(x => x.id === noteId)
                            if (noteIndex > -1) {
                              context.$store.dispatch('addEntry', {
                                entry: 'selected',
                                source: context.$store.state.notes.notes[noteIndex]
                              })
                            }
                          }
                        }
                      })
                    }
                  }
                }
              })
            }
          }
        }, 100)
      } else {
        this.$store.dispatch('clearEntries', {
          entry: 'selected',
          source: null
        })
      }
    }
  }
}
</script>
