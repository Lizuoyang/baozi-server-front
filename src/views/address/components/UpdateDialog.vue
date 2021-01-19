<template>
  <el-dialog v-el-drag-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="45%">
    <el-form :inline="true" class="demo-form-inline" :model="dialog.orgUser" :rules="orgUserRules" ref="orgUserRuleForm"
             label-width="100px">
      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="成员账号:" prop="jobId">
            <el-input v-model="dialog.orgUser.jobId" placeholder="请输入成员账号" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="成员姓名:" prop="name">
            <el-input v-model="dialog.orgUser.name" placeholder="请输入成员姓名">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成员性别:" prop="genderText">
            <el-radio-group v-model="dialog.orgUser.genderText">
              <el-radio-button label="男"></el-radio-button>
              <el-radio-button label="女"></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="账号类型:" prop="userType">
            <el-select style="width: 92%" v-model="dialog.orgUser.userType" placeholder="请选择账号类型" clearable filterable>
              <el-option label="内部虚拟帐号" value="2">
              </el-option>
              <el-option label="外部帐号" value="3">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成员职务:" prop="jobName">
            <el-input v-model="dialog.orgUser.jobName" placeholder="请输入成员职务">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="成员手机:" prop="cellphone">
            <el-input v-model="dialog.orgUser.cellphone" placeholder="请输入成员手机"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成员邮箱:" prop="email">
            <el-input v-model="dialog.orgUser.email" placeholder="请输入成员邮箱"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitMenuForm">确 定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import {saveDepartUser} from '@/api/departuser'
  export default {
    name: "UpdateDialog.vue",
    data() {
      let validateTelPhone = (rule, value, callback) => {
        if (!/^1\d{10}$/.test(value)) {
          callback(new Error('请输入正确的手机号!'));
        } else {
          callback();
        }
      };
      return {
        orgUserRules: {
          name: [
            {required: true, message: '请输入成员名称', trigger: 'blur'},
          ],
          jobName: [
            {required: true, message: '请输入成员职务', trigger: 'blur'},
          ],
          userType: [
            {required: true, message: '请选择账号类型', trigger: 'blur'},
          ],
          cellphone: [
            {validator: validateTelPhone, trigger: 'blur'},
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        }
      }
    },
    created() {

    },
    methods: {
      submitMenuForm() {
        this.$refs['orgUserRuleForm'].validate(async valid => {
          if (valid) {
            let result = await saveDepartUser(this.dialog.orgUser)
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
      },
    },
    props: {
      dialog: {
        type: Object,
        default: () => {
        }
      }
    }
  }
</script>

<style scoped>

</style>
