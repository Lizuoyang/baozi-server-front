<template>
  <el-breadcrumb class="app-breadcrumb" separator="/" style="width: 88%">
    <div style="float: right">
      <el-tooltip effect="dark" content="Github地址" placement="bottom">
        <svg-icon class="iconClass" icon-class="github" @click="toGithub"/>
      </el-tooltip>
      <el-tooltip effect="dark" :content="fullscreen.title" placement="bottom">
        <svg-icon class="iconClass" :icon-class="fullscreen.icon" @click="fullscreenClick"/>
      </el-tooltip>
      <el-tooltip effect="dark" content="退出" placement="bottom">
        <svg-icon class="iconClass" icon-class="exit" @click="logout"/>
      </el-tooltip>
      <el-tooltip effect="dark" content="主题颜色" placement="bottom">
        <theme-picker @change="themeChange" style="float: right;height: 26px;margin: 9px -25px 0 10px;"/>
      </el-tooltip>
    </div>
    <el-tabs v-model="_.cloneDeep(activeTab)" @tab-click="handleTabsClick" ref="systemTabs" style="width: 88%">
      <el-tab-pane v-for="item in systemMenus" :key="item.id" :label="item.systemName"
                   :name="_.toString(item.id)"></el-tab-pane>
    </el-tabs>
  </el-breadcrumb>
</template>

<script>
  import {mapGetters} from "vuex";
  import store from "@/store";
  import ThemePicker from '@/components/ThemePicker'
  import screenfull from "screenfull";
  export default {
    name: "BreadcrumbMenu",
    data() {
      return {
        fullscreen: {
          title: "全屏显示",
          icon: 'fullscreen',
          visible: false
        }
      }
    },
    computed: {
      ...mapGetters([
        'activeTab',
        'systemMenus',
      ])
    },
    components: {
      ThemePicker
    },
    watch: {
      $route() {
        if (this.$route.meta.systemId) {
          this.$store.dispatch("menu/changeActiveTab", this.$route.meta.systemId[0])
        }
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destroy()
    },
    async created() {
    },
    methods: {
      toGithub() {
        window.open("https://github.com/Lizuoyang/baozi-server-admin")
      },
      async logout() {
        this.$confirm('亲，确定要退出了吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
      },
      change() {
        this.fullscreen.visible = screenfull.isFullscreen
        // console.log("change: ",this.fullscreen.visible)
        this.fullscreen.title = this.fullscreen.visible ? '退出全屏' : '全屏显示'
        this.fullscreen.icon = this.fullscreen.visible ? 'exit-fullscreen' : 'fullscreen'
      },
      destroy() {
        screenfull.off('change', this.change)
      },
      init() {
        screenfull.on('change', this.change)
      },
      fullscreenClick() {
        screenfull.toggle()
      },
      themeChange(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'theme',
          value: val
        })
      },
      handleTabsClick(data) {
        this.$store.dispatch("menu/changeActiveTab", data.name)
      },
    }
  }
</script>
<style scoped>
  .iconClass {
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-left: 10px;
  }
</style>
<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
