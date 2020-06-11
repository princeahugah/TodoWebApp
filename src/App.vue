<template>
    <transition name="fade"
                mode="out-in">
        <v-app class="layout">
            <div class="l-content">
                <router-view />
            </div>
            <v-footer>
                <span class="mr-3">version GIT_COMMIT_ID</span>
            </v-footer>
        </v-app>
    </transition>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class App extends Vue {}
</script>

<style src="@scss/main.scss" lang="scss"></style>
<style lang="scss" scoped>
  .layout {
    .v-footer {
      padding-top: 40px;
      justify-content: center;
      background-color: transparent;
      span {
        font-size: 0.8rem;
      }
    }
  }
</style>
