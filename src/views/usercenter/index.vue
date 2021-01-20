<template>
  <el-card class="box-card">
    <div class="dashboard-container">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-info-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card style="margin-top:10px;">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="修改个人信息" name="account">
                <el-form  :model="formUser" :rules="userRules" ref="userInfoForm" label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="登录账号:" prop="loginName">
                    <el-input v-model="formUser.loginName" :disabled="formUser.id != null" placeholder="请输入登录账号"></el-input>
                  </el-form-item>

                  <el-form-item label="登录密码:" prop="password">
                    <el-input v-model="formUser.password" placeholder="6-18位字母、数字、特殊符号" ></el-input>
                  </el-form-item>

                  <el-form-item label="用户昵称:" prop="userName">
                    <el-input v-model="formUser.userName" placeholder="请输入用户昵称"></el-input>
                  </el-form-item>

                  <el-form-item label="性别:">
                    <el-radio v-model="formUser.sex" label="男">男</el-radio>
                    <el-radio v-model="formUser.sex" label="女">女</el-radio>
                  </el-form-item>

                  <el-form-item label="角色选择:" prop="roleId">
                    <el-select v-model="formUser.roleId" :disabled="!_.eq(user.roleCode, 'admin')" style="width: 100%" placeholder="请选择角色" clearable filterable auto-complete="false">
                      <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="联系方式:" prop="phone">
                    <el-input v-model.number="formUser.phone" placeholder="请输入联系方式"></el-input>
                  </el-form-item>

                  <el-form-item label="邮箱地址:" prop="email">
                    <el-input v-model="formUser.email" placeholder="请输入邮箱地址"></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="submitForm" icon="el-icon-circle-check">修改</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
  import UserInfoCard from './components/UserInfoCard'
  import {mapGetters} from "vuex";
  import {checkInfo, saveUser, updateUser} from "@/api/user";
  import {getRoleList} from "@/api/role";
  export default {
    name: "UserCenter",
    data () {
      let validateTelPhone = (rule, value, callback) => {
        if (!/^1\d{10}$/.test(value)) {
          callback(new Error('请输入正确的手机号!'));
        } else {
          callback();
        }
      };

      let validatePassword = (rule, value, callback) => {
        if (this.formUser.id == null) {
          if (_.isEmpty(value)) {
            callback(new Error('请输入登录密码!'));
          }
        }

        if (!_.isEmpty(value)) {
          let reg =/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,18}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的密码格式'));
          }
        }

        callback();
      };

      let validateLoginName = (rule, value, callback) => {
        checkInfo('login_name', value).then(res => {
          let queryUserId = _.get(res.data, 'loginName', null)
          if (_.isEmpty(this.formUser.id) && queryUserId == value) {
            callback(new Error('登录账号已存在'));
          } else {
            callback();
          }
        });

      }
      return {
        activeTab: 'account',
        formUser: {
        },
        userRules: {
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          loginName: [
            {required: true, message: '请输入登录账号', trigger: 'blur'},
            {validator: validateLoginName, trigger: ['blur']},
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'},
          ],
          userName: [
            {required: true, message: '请输入用户昵称', trigger: 'blur'},
          ],
          roleId: [
            {required: true, message: '请选择角色', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入用户联系方式', trigger: 'blur'},
            { type: 'number', message: '联系方式必须为数字值'},
            { validator: validateTelPhone, trigger: 'blur' }
          ]
        },
        roleList: [],
      }
    },
    components: {
      UserInfoCard
    },
    created() {
      this.initUserInfo()
      this.initRoles()
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      initUserInfo() {
        let cloneDeepUser = _.cloneDeep(this.user)
        cloneDeepUser.phone = parseInt(cloneDeepUser.phone)
        this.formUser = cloneDeepUser
      },
      submitForm() {
        this.$refs['userInfoForm'].validate(async valid => {
          if (valid) {
            this.$confirm('修改个人信息后需重新登录，确定修改吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let params = {
                id : this.formUser.id,
                userName: this.formUser.userName,
                loginName: this.formUser.loginName,
                password: this.formUser.password,
                sex: this.formUser.sex,
                phone: this.formUser.phone,
                email: this.formUser.email,
                isDelete: this.formUser.isDelete,
                roleId: this.formUser.roleId,
                actionBy: this.user.loginName,
              }

              // console.log(params)
              let res = await updateUser(params)
              let result = res.data
              if (result) {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              }
            })
          } else {
            return false;
          }
        })
      },
      async initRoles() {
        const {data} = await getRoleList();
        this.roleList = data
      },
    }
  }
</script>

<style scoped>

</style>
