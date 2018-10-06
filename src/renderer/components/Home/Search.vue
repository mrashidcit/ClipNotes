<template>
  <div id="search-view" :style="`display: ${onViewSearch ? 'block' : 'none'}`">
    <h3>Filter nots with tags</h3>
    <p>Results: <b>{{list.length}}</b></p>
    <v-combobox
      v-model="select"
      :items="tags"
      label="Select Tags"
      item-text="title"
      multiple
      @keyup.enter="onTagSelection"
      chips solo>
      <template
        slot="selection"
        slot-scope="data">
        <v-chip
          :key="`${data.item.id}`"
          class="v-chip--select-multi">
          {{ data.item.title }}
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: [
    'onViewSearch',
    'tags',
    'list'
  ],
  data () {
    return {
      select: []
    }
  },
  computed: {
    onSelectChange () {
      return this.select
    }
  },
  watch: {
    onSelectChange () {
      this.$root.$emit('filterNotes', this.select)
    }
  },
  methods: {
    onTagSelection () {
      if (this.select && this.select.constructor === [].constructor &&
        this.tags && this.tags.constructor === [].constructor &&
        this.select.length > 0) {
        const eIndex = this.select.length - 1
        const newTagName = (`${this.select[eIndex]}`).toLowerCase()
        const tagIndex = this.tags.length > 0
          ? this.tags.findIndex(x => x.title === newTagName)
          : -1
        this.select.splice(eIndex, 1)
        if (newTagName && tagIndex < 0) {
          this.select.push({
            id: null,
            title: newTagName,
            value: `tag_${newTagName}`
          })
        } else {
          this.select.push(this.tags[tagIndex])
        }
      }
    }
  }
}
</script>
