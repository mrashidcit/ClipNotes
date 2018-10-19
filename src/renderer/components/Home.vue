<template>
  <div>
    <div
      :style="goBlur() ? `filter: blur(8px);-webkit-filter: blur(8px);`: null">
      <sidebar />
      <page />
    </div>
    <add />
    <about />
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Page from './Page'
import Add from './Views/Add'
import About from './Views/About'

export default {
  name: 'home',
  components: {
    Sidebar,
    Page,
    Add,
    About
  },
  methods: {
    goBlur () {
      if (
        this.$store.state.config.add.state ||
        this.$store.state.config.about.state ||
        this.$store.state.config.loadImage.state
      ) {
        return true
      }
      return false
    }
  }
}
</script>
