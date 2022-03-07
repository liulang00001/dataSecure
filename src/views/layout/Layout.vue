<template>
  <div>
    <div v-if="!isQiankun" class="app-wrapper" :class="classObj">
      <sidebar :class="['sidebar-container', isQiankun ? 'qiankun-sidebar-container' : 'self-sidebar-container']"></sidebar>
      <div class="main-container">
        <breadcrumb style="line-height: 38px;"></breadcrumb>
        <tags-view></tags-view>
        <app-main></app-main>
      </div>
    </div>
    <app-main v-if="isQiankun"></app-main>
  </div>
</template>

<script>
import { Sidebar, AppMain, TagsView } from './components'
import watermark from '@shareit/watermark'
import { getName } from '@/utils/user'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'layout',
  components: {
    Sidebar,
    AppMain,
    TagsView,
    Breadcrumb
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      let hideSidebar = false;
      if(this.$store.getters.isQiankun) {
        hideSidebar = !this.sidebar.opened
      }
      return {
        hideSidebar: hideSidebar,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    isQiankun() {
      return this.$store.getters.isQiankun || false;
    },
  },
  mounted() {
    if(!this.$store.getters.isQiankun) {
      this.$nextTick(() => {
        watermark({
          renderNode: 'app',
          text: `${getName()}(${this.$util.formatTime(new Date().getTime(), 'YYYY-MM-DD')})`,
          mode: 'cover',
          density: 'low',
          position: {
            zIndex: 10000
          },
          font: {
            rotate: 15,
            opacity: 0.1,
            color: '#000',
            size: '16px'
          }
        })
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    min-width: 1000px;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
