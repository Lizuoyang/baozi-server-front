<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb-menu class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.imageUrl+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item>
            <i class="el-icon-user" @click="info"> 个人中心</i>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="fullscreenClick">
              <svg-icon :icon-class="fullscreen.icon"/><span> {{fullscreen.title}}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <i class="el-icon-switch-button" > 退出登录</i>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/index'
import BreadcrumbMenu from '@/components/Breadcrumb/menu'
import Hamburger from '@/components/Hamburger'
import screenfull from 'screenfull'
export default {
  data(){
    return {
      activeIndex: '1',
      fullscreen: {
        visible: false,
        title: '全屏显示',
        icon: 'fullscreen'
      }

    }
  },
  components: {
    Breadcrumb,
    BreadcrumbMenu,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user'
    ])
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    change() {
      this.fullscreen.visible = screenfull.isFullscreen
      console.log("change: ",this.fullscreen.visible)
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
    info() {
      this.$router.push(`/usercenter/index`)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
