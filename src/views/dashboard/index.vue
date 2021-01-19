<template>
  <el-card class="box-card">
    <div class="dashboard-head">
    </div>
    <div class="dashboard-container">
      <div class="dashboard-text">欢迎您：{{ user.roleName + ' , ' + user.userName }}</div>
    </div>
  </el-card>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      /*this.$notify.success({
        title: 'Welcome',
        position: 'bottom-right',
        message: '欢迎回来，' + this.user.userName,
        showClose: true
      });*/
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
