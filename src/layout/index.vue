<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main ref="appMain" v-loading.fullscreen.lock="fullscreenLoading"/>
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Settings, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import RightPanel from '@/components/RightPanel'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Settings,
    RightPanel,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fullscreenLoading: state => state.settings.fullscreenLoading,
    }),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss">
  .iframe-container {
    position: absolute;
    top: 115px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin-top: -29px;
    .frame {
      position: relative;
      top: 0px;
      width: 100%;
      height: 100%;
    }
  }

  .box-card{
    position: absolute;
    width: calc(100%);
    height: calc(100%);
  }

  .dashboard {
    &-head {
      margin-top: 40px;
    }

    &-container {
      margin: 20px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
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

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
