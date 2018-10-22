<template>
  <div>
    <transition name="fade">
      <div v-if="!$store.state.config.loader.state"
        :style="goBlur() ? `filter: blur(8px);-webkit-filter: blur(8px);`: null">
          <sidebar />
          <page />
      </div>
    </transition>
    <div class="hero-x-y"
      v-if="$store.state.config.loader.state">
      <img style="height: 120px;width: auto;"
        src="../assets/logo-hero.png">
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
  mounted () {
    const context = this
    this.$nextTick(function () {
      setTimeout(function () {
        context.$store.dispatch('setState', {
          name: 'loader',
          state: false
        })
      }, 2000)
    })
  },
  methods: {
    goBlur () {
      if (
        this.$store.state.config.add.state ||
        this.$store.state.config.about.state ||
        this.$store.state.config.loading.state ||
         this.$store.state.config.genericMessage.state
      ) {
        return true
      }
      return false
    }
  }
}
</script>
