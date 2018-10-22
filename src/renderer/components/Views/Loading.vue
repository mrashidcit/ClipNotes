<template>
  <transition name="fade">
    <div class="glass-view"
      v-if="$store.state.config.loading.state">
      <div class="hero-x-y" style="text-align: center">
        <h1>
          {{ $store.state.config.loading.text }} 
        </h1>
      </div>
    </div>
  </transition>
</template>
