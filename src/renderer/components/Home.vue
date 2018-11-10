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
      <img style="height: 100px;width: auto;"
        src="../assets/logo-hero.png">
    </div>
    <add />
    <edit />
    <manage-tags />
    <about />
    <generic-message />
    <action-dialog />
    <loading />
    <view-note />
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import Page from './Page'
import Add from './Views/Add'
import Edit from './Views/Edit'
import ManageTags from './Views/ManageTags'
import About from './Views/About'
import ViewNote from './Views/ViewNote'
import GenericMessage from './Views/GenericMessage'
import ActionDialog from './Views/ActionDialog'
import Loading from './Views/Loading'

export default {
  name: 'home',
  components: {
    Sidebar,
    Page,
    Add,
    Edit,
    ManageTags,
    About,
    GenericMessage,
    ActionDialog,
    Loading,
    ViewNote
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
        this.$store.state.config.edit.state ||
        this.$store.state.config.manageTags.state ||
        this.$store.state.config.about.state ||
        this.$store.state.config.loading.state ||
        this.$store.state.config.genericMessage.state ||
        this.$store.state.config.actionDialog.state ||
        this.$store.state.config.viewNote.state
      ) {
        return true
      }
      return false
    }
  }
}
</script>
