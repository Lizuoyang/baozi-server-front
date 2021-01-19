<template>
  <el-dialog v-el-drag-dialog :title="dialog.title" :visible="dialog.visible" show-close width="30%" @close="dialog.visible = false">
    <el-form style="width: 400px" :model="dialog.role" :rules="roleRules" ref="roleRuleForm" label-width="100px"
             class="demo-roleForm">
      <el-form-item label="角色名称：" prop="roleName">
        <el-input v-model="dialog.role.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>

      <el-form-item label="角色编码：" prop="roleCode">
        <el-input v-model="dialog.role.roleCode" placeholder="请输入角色编码"></el-input>
      </el-form-item>

      <el-form-item label="排序：" prop="roleSort">
        <el-input-number v-model="dialog.role.roleSort"  :min="1" :max="100" step-strictly controls-position="right" size="small"></el-input-number>
      </el-form-item>
      <el-form-item label="是否启用：" prop="isDelete">
        <el-switch v-model="dialog.role.isDelete" ></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitUserForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {saveRole} from "@/api/role";
  import {updateRole} from "@/api/role";
  export default {
    name: 'UpdateDialog',
    data() {
      return {
        roleRules: {
          roleCode: [
            { required: true, message: '请输入角色编码', trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      dialog: {
        type: Object,
        default: null
      }
    },

    methods: {
       submitUserForm() {
        this.$refs['roleRuleForm'].validate(async valid => {
          if (valid) {
            let params = {
              roleCode: this.dialog.role.roleCode,
              roleName: this.dialog.role.roleName,
              roleSort: this.dialog.role.roleSort,
              isDelete: this.dialog.role.isDelete
            }
            let result = false;
            if (!_.isEmpty(this.dialog.role.id)) {
              params.id = this.dialog.role.id
              let res = await updateRole(params)
              result = res.data
            } else {
              let res =await saveRole(params)
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
