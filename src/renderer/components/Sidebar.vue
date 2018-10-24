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
      :label="`Strict Filter: ${strictFilterState ? 'ON' : 'OFF'}`"
      v-model="strictFilterState">
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
      strictFilterState: false,
      select: [],
      selectedBackup: [],
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
  computed: {
    onStrictFitlerChange () {
      return this.strictFilterState
    },
    onTagSelctionChange () {
      return this.$store.state.config.tagSelection
    }
  },
  watch: {
    onStrictFitlerChange (state) {
      if (state) {
        this.onToggleStrictFilter(state)
      } else {
        this.onChangeFilter()
      }
    },
    onTagSelctionChange (selection) {
      this.onToggleStrictFilter(this.onStrictFitlerChange)
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
        // Generate Valid IDs
        const validIds = []
        if (this.$store.state.notes.filter.length > 0) {
          this.select.forEach((selection) => {
            if (selection) {
              let tagIndex = null
              if (selection && selection.constructor === {}.constructor) {
                tagIndex = context.$store.state.notes.tags
                  .findIndex(x => x.title === selection.title)
              } else if (selection && typeof selection === 'string') {
                tagIndex = context.$store.state.notes.tags
                  .findIndex(x => x.title === selection)
              }
              if (tagIndex !== null && tagIndex > -1) {
                const tagId = context.$store.state.notes.tags[tagIndex].id
                const filter = context.$store.state.notes.filter
                if (filter.constructor === [].constructor) {
                  filter.forEach((filterItem) => {
                    if (filterItem.tag === tagId) {
                      if (validIds.findIndex(x => x === filterItem.note) < 0) {
                        const noteId = filterItem.note
                        const noteIndex = context.$store.state.notes.notes
                          .findIndex(x => x.id === noteId)
                        if (noteIndex > -1) {
                          validIds.push(context.$store.state.notes.notes[noteIndex].id)
                        }
                      }
                    }
                  })
                }
              }
            }
          })
        }
        // Add notes if any
        validIds.forEach((validId) => {
          const noteIndex = context.$store.state.notes.notes
            .findIndex(x => x.id === validId)
          if (noteIndex > -1) {
            if (context.$store.state.notes.selected.findIndex(x => x.id === validId) < 0) {
              context.$store.dispatch('addEntry', {
                entry: 'selected',
                source: context.$store.state.notes.notes[noteIndex]
              })
            }
          }
        })
        // Remove notes if any
        const selectedClone = Object.assign([], context.$store.state.notes.selected)
        selectedClone.forEach((item) => {
          let valid = false
          for (let loop = 0; loop < validIds.length; loop++) {
            if (validIds[loop] === item.id) {
              valid = true
              break
            }
          }
          if (!valid) {
            this.$store.dispatch('removeEntry', {
              entry: 'selected',
              source: item
            })
          }
        })
        this.$store.dispatch('setState', {
          name: 'tagSelection',
          data: this.select
        })
      } else {
        this.$store.dispatch('clearEntries', {
          entry: 'selected',
          source: null
        })
        this.$store.dispatch('setState', {
          name: 'tagSelection',
          data: []
        })
      }
    },
    onToggleStrictFilter (state) {
      this.$store.dispatch('setState', {
        name: 'strictFilter',
        state: state
      })
      if (this.$store.state.notes.selected.length < 1 || !state) {
        return
      }
      const context = this
      const tagSelection = this.$store.state.config.tagSelection
      if (tagSelection && tagSelection.constructor === [].constructor) {
        const tagIDs = []
        tagSelection.forEach((tag) => {
          let tagIndex = null
          if (tag && tag.constructor === {}.constructor) {
            tagIndex = context.$store.state.notes.tags
              .findIndex(x => x.title === tag.title)
          } else if (tag && typeof tag === 'string') {
            tagIndex = context.$store.state.notes.tags
              .findIndex(x => x.title === tag)
          }
          tagIDs.push(context.$store.state.notes.tags[tagIndex].id)
        })
        if (tagIDs && tagIDs.constructor === [].constructor &&
          tagIDs.length > 0) {
          context.selectedBackup = Object.assign([], context.$store.state.notes.selected)
          const selected = Object.assign([], context.$store.state.notes.selected)
          const filter = Object.assign([], context.$store.state.notes.filter)
          selected.forEach((noteItem) => {
            let toDelete = false
            for (let index = 0; index < tagIDs.length; index++) {
              if (filter.findIndex(x => (x.tag === tagIDs[index] && x.note === noteItem.id)) < 0) {
                toDelete = true
                break
              }
            }
            if (toDelete) {
              context.$store.dispatch('removeEntry', {
                entry: 'selected',
                source: noteItem
              })
            }
          })
        }
      }
    }
  }
}
</script>
