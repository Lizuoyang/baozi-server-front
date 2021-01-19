<template>
  <el-dialog v-el-drag-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="30%" top="5vh">
    <el-form style="width: 400px" :model="dialog.user" :rules="userRules" ref="userRuleForm" label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="登录账号:" prop="loginName">
        <el-input v-model="dialog.user.loginName" :disabled="dialog.user.id != null" placeholder="请输入登录账号"></el-input>
      </el-form-item>

      <el-form-item label="登录密码:" prop="password">
        <el-input v-model="dialog.user.password" placeholder="6-18位字母、数字、特殊符号" ></el-input>
      </el-form-item>

      <el-form-item label="用户昵称:" prop="userName">
        <el-input v-model="dialog.user.userName" placeholder="请输入用户昵称"></el-input>
      </el-form-item>

      <el-form-item label="性别:">
        <el-radio v-model="dialog.user.sex" label="0">男</el-radio>
        <el-radio v-model="dialog.user.sex" label="1">女</el-radio>
      </el-form-item>

      <el-form-item label="角色选择:" prop="roleId">
        <el-select v-model="dialog.user.roleId" placeholder="请选择角色" clearable filterable auto-complete="false">
          <el-option v-for="role in dialog.roleList" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="企业选择:" prop="corpIds">
        <el-select v-model="dialog.user.corpIds" placeholder="请选择企业" clearable multiple filterable auto-complete="false">
          <el-option v-for="corp in dialog.corpList" :key="corp.id" :label="corp.corpName" :value="corp.corpId"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="联系方式:" prop="phone">
        <el-input v-model.number="dialog.user.phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>

      <el-form-item label="邮箱地址:" prop="email">
        <el-input v-model="dialog.user.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>

      <el-form-item label="是否启用:" prop="isDelete">
        <el-switch v-model="dialog.user.isDelete" ></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submitUserForm" icon="el-icon-circle-check">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { checkInfo, saveUser, updateUser } from '@/api/user'
  import { mapGetters } from 'vuex'
  export default {
    name: "UpdateDialog",
    data() {
      let validateTelPhone = (rule, value, callback) => {
        if (!/^1\d{10}$/.test(value)) {
          callback(new Error('请输入正确的手机号!'));
        } else {
          callback();
        }
      };

      let validatePassword = (rule, value, callback) => {
        if (this.dialog.user.id == null) {
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
          if (_.isEmpty(this.dialog.user.id) && queryUserId == value) {
            callback(new Error('登录账号已存在'));
          } else {
            callback();
          }
        });

      }
      return {
        userForm: {},
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
          corpIds: [
            {required: true, message: '请选择企业', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入用户联系方式', trigger: 'blur'},
            { type: 'number', message: '联系方式必须为数字值'},
            { validator: validateTelPhone, trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      dialog: {
        type: Object,
        default: null
      },
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      async submitUserForm() {
        this.$refs['userRuleForm'].validate(async valid => {
          if (valid) {
            let params = {
              userName: this.dialog.user.userName,
              loginName: this.dialog.user.loginName,
              password: this.dialog.user.password,
              sex: this.dialog.user.sex,
              phone: this.dialog.user.phone,
              email: this.dialog.user.email,
              isDelete: this.dialog.user.isDelete,
              roleId: this.dialog.user.roleId,
              actionBy: this.user.loginName,
              corpIds: this.dialog.user.corpIds
            }

            let result = false;
            if (!_.isEmpty(this.dialog.user.id)) {
              params.id = this.dialog.user.id;
              let res = await updateUser(params)
              result = res.data
            } else {
              let res = await saveUser(params)
              result = res.data
            }

            this.dialog.visible = !result;
            this.$notify({
              type: result ? 'success' : 'error',
              title: this.dialog.title,
              position: 'top-right',
              message: result ? '成功' : '失败',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          } else {
            return false;
          }
        })

      }
    }
  }
</script>

<style scoped>

</style>
