<template>
  <div id="login" >
    <div class="loginConbox">
      <div class="header">
        <div style="padding: 15px; float: left; margin-left: 100px">
          <svg-icon icon-class="logo" style="width: 120px;height: 30px"></svg-icon>
        </div>
        <div style="padding: 200px">
          <span class="head-title">登录</span>
        </div>

      </div>
      <div class="loginBox" >
        <div class="loginCon" >
          <span class="title" :style="titleColor" style="cursor: pointer" @mouseover="handleTitleMouseOver" @mouseleave="handleTitleMouseOut" >包子中台管理系统</span>
          <span class="sub-title" >If you don't think about being a god, you should be a secular person.</span>
          <el-card shadow="always" class="login-module">
            <div slot="header" class="clearfix formTitlt">
              <span>密码登录</span>
              <span class="titIconbox">
              <i class="iconfont xu-saomadenglu2 fa-lg iconcolor"></i>
            </span>
            </div>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" status-icon label-width="100px" class="demo-ruleForm">
              <el-form-item prop="username">
                <el-input
                  type="text"
                  ref="username"
                  v-model="loginForm.username"
                  placeholder="请输入登录账号"
                  name="username"
                  tabindex="1"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  :type="passwordType"
                  v-model="loginForm.password"
                  name="password"
                  ref="password"
                  tabindex="2"
                  autocomplete="off"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                  placeholder="请输入登录密码">
                  <template slot="append">
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" style="cursor: pointer"/>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" class="subBtn" type="primary" @click="handleLogin">登录</el-button>
              </el-form-item>
              <p class="smalltxt">
                <router-link class="a" to="#">忘记密码</router-link>
                <router-link class="a" to="#">免费注册</router-link>
              </p>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      const validateUsername = (rule, value, callback) => {
        if (_.isEmpty(value)) {
          callback(new Error('用户名不能为空'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (_.isEmpty(value)) {
          callback(new Error('密码不能为空'));
        }
        if (value.length < 6) {
          callback(new Error('密码不能小于6位数'));
        } else {
          callback();
        }
      }
      return {
        loginForm: {
          username: "lizuoyang",
          password: "qwe22515"
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        loading: false,
        showDialog: false,
        redirect: undefined,
        otherQuery: {},
        passwordType: 'password',
        bgImage: {
          backgroundImage: "url(" + require("../../assets/images/background-image.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%"
        },
        titleColor:''
      }
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    methods: {
      handleTitleMouseOver(){
        this.titleColor = 'color: #409EFF';
      },
      handleTitleMouseOut(){
        this.titleColor = '';
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm)
              .then(token => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    }
  }
</script>
<style lang="scss">
  #login {
    width: 100%;
    height: 100%;
    .loginConbox{
    }
    .header {
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
      background-color: white;
      height: 60px;
      position: relative;
      /*border-bottom: 1px solid rgba(255, 255, 255, 0.3);*/
      .logo{
        margin-left: 30px;
        width: 500px;
        float: left;
        height: 40px;
        padding-top: 10px;
        img{
          height: 100%;
        }
      }
    }

    .head-title{
      text-align: left;
      font-size: 20px;
      color: #181818;
      letter-spacing: 0;
      display: inline-block;
      padding: 0 10px;
      vertical-align: bottom;
      border-left: 1px solid #999;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .loginBox {
      .iconcolor {
        color: #409EFF;
      }

      padding: 74px 0 118px;

      .loginCon {
        width: 990px;
        margin: auto;
        position: relative;
        height: 388px;

        .el-card__header {
          border-bottom: 0px;
        }
        .title{
          font-size: 28px;
          font-weight: 600;
          color: #181818;
          width: 500px;
          float: left;
          margin-top: 0px;
          &:first-child{
            font-size: 34px;
            margin-top: 50px;
            margin-bottom: 30px;
          }
        }

        .sub-title{
          line-height: 30px;
          font-size: 16px;
          color: #999;
          width: 500px;
          float: left;
          margin-top: 0px;
          &:first-child{
            font-size: 34px;
            margin-top: 50px;
            margin-bottom: 30px;
          }
        }
    .login-module {
          width: 380px;
          height: 325px;
          margin-top: 60px;
          border: none;
          position: absolute;
          right: 0;
          box-shadow: 0 2px 15px rgba(0,0,0,.15);

          .formTitlt {
            font-size: 18px;
            font-weight: 400;

            .titIconbox {
              float: right;

              .pointer {
                cursor: pointer;
              }
            }
          }

          .smalltxt {
            text-align: right;

            .a {
              text-decoration: none;
              color: #999999;
              font-size: 12px;
              margin-left: 8px;
            }
          }
        }

        .el-form-item__content {
          margin-left: 0px !important;

          .subBtn {
            width: 100%;
          }
        }
      }

      .el-input__inner, .el-button, .el-card, .el-message {
        border-radius: 0px !important;
      }

      .el-form-item__content .ico {
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 999;
        width: 40px;
        height: 39px;
        text-align: center;
        border-right: 1px solid #ccc;
      }

      .ewmbox {
        width: 100%;
        height: 240px;
        margin-top: -25px;

        .ewm {
          width: 140px;
          height: 140px;
          margin: 20px auto;

          p {
            font-size: 12px;
            padding-left: 40px;
            margin: 0;
          }
        }

        .ewmicon {
          width: 140px;
          margin: 20px auto 0;

          .iconfont {
            float: left;
          }

          p {
            font-size: 12px;
            padding-left: 40px;
            margin: 0;
          }
        }
      }
    }
  }
</style>
