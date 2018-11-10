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
    <v-snackbar
      v-model="snackbar"
      :color="$store.state.config.snackbar.background"
      :bottom="$store.state.config.snackbar.position === 'bottom'"
      :left="$store.state.config.snackbar.align === 'left'"
      :multi-line="$store.state.config.snackbar.mode === 'multi-line'"
      :right="$store.state.config.snackbar.align === 'right'"
      :timeout="$store.state.config.snackbar.timeout"
      :top="$store.state.config.snackbar.position === 'top'"
      :vertical="$store.state.config.snackbar.mode === 'vertical'">
      <strong :class="`${$store.state.config.snackbar.color}`">
        {{ $store.state.config.snackbar.message }}
      </strong>
      <v-btn
        flat icon
        @click="$store.dispatch('setState', {
          name: 'snackbar',
          state: false
        })">
        <v-icon :class="`${$store.state.config.snackbar.color}`">
          close
        </v-icon>
      </v-btn>
    </v-snackbar>
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
  data () {
    return {
      snackbar: false
    }
  },
  computed: {
    onSnackbarLocalChange: function () {
      return this.snackbar
    },
    onSnackbarStoreChange: function () {
      return this.$store.state.config.snackbar.state
    }
  },
  watch: {
    onSnackbarLocalChange: function (state) {
      if (!state) {
        this.$store.dispatch('setState', {
          name: 'snackbar',
          state: false
        })
      }
    },
    onSnackbarStoreChange: function (state) {
      this.snackbar = state
    }
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
