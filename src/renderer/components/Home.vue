<template>
  <div>
    <div
      :style="goBlur() ? `filter: blur(8px);-webkit-filter: blur(8px);`: null">
      <sidebar />
      <page />
    </div>
    <add />
    <about />
    <generic-message />
    <loading />
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Page from './Page'
import Add from './Views/Add'
import About from './Views/About'
import GenericMessage from './Views/GenericMessage'
import Loading from './Views/Loading'

export default {
  name: 'home',
  components: {
    Sidebar,
    Page,
    Add,
    About,
    GenericMessage,
    Loading
  },
  methods: {
    goBlur () {
      if (
        this.$store.state.config.add.state ||
        this.$store.state.config.about.state ||
        this.$store.state.config.loadImage.state ||
         this.$store.state.config.genericMessage.state
      ) {
        return true
      }
      return false
    }
  }
}
</script>
