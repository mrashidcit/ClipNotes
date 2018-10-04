<template>
  <div id="search-view" :style="`display: ${onViewSearch ? 'block' : 'none'}`" :data-view="prep(onViewSearch)"> 
    <select id="search-tags" class="ui fluid search dropdown" multiple="">
      <option value="">Search with Tags</option>
      <options v-for="item in tags"
        :key="item.id"
        :tagItem="item"/>
    </select>
  </div>
</template>

<script>
import Options from './Search/Options'

export default {
  name: 'search',
  props: ['onViewSearch', 'tags'],
  components: {
    Options
  },
  mounted () {
    window.jQuery('#search-tags').dropdown({
      allowAdditions: true
    })
  },
  methods: {
    prep (value) {
      this.$nextTick(() => {
        window.jQuery('#search-tags').dropdown({
          allowAdditions: true
        })
      })
    }
  }
}
</script>
