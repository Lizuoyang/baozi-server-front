<template>
  <el-card style="margin-bottom:20px;margin-top:20px;">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <thumb :image="require('../../../assets/images/user-avator.png')" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.sex == '男' ? '小哥哥' : '小姐姐' }}
        </thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.roleName }}</div>
        <div class="user-role text-center text-muted">{{ _.upperFirst(user.roleCode) }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="phone" /><span>联系电话</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.phone}}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="email" /><span>邮箱地址</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.email}}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import Thumb from '@/components/Thumb/index'
  export default {
    name: "UserInfoCard",
    components: {
      Thumb
    },
    props: {
      user: {
        type: Object,
        default: () => {}
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
  }

  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #606266;

    span {
      padding-left: 4px;
    }

    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;

      .user-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
    }
  }
</style>

