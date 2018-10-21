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
      <p class="filter-count">0</p>
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
      console.log('onChangeFilter: ', this.select)
      if (
        this.select &&
        this.select.constructor === [].constructor &&
        this.select.length > 0
      ) {
        const context = this
        if (this.$store.state.notes.selected.length < 1) {
          if (this.$store.state.notes.filter.length > 0) {
            console.log('selected are empty')
          }
        } else {
          this.select.forEach((item) => {
            const targetIndex = context.$store.state.notes.selected
              .findIndex(x => x.title === item)
            if (targetIndex < 0) {
              // Modify
            }
          })
        }
      }
      console.log(this.$store.state.notes.selected)
    }
  }
}
</script>
