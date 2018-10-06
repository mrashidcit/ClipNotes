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
  }
}
</script>
