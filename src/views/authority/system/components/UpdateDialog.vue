<template>
  <el-dialog v-el-drag-dialog :title="dialog.title" :visible="dialog.visible" show-close width="30%" @close="dialog.visible = false">
    <el-form style="width: 400px" :model="dialog.system" :rules="systemRules" ref="systemRuleForm" label-width="100px"
             class="demo-roleForm">
      <el-form-item label="系统名称：" prop="systemName">
        <el-input v-model="dialog.system.systemName" placeholder="请输入系统名称"></el-input>
      </el-form-item>

      <el-form-item label="系统编码：" prop="systemCode">
        <el-input v-model="dialog.system.systemCode" placeholder="请输入系统编码"></el-input>
      </el-form-item>

      <el-form-item label="排序：" prop="systemSort">
        <el-input-number v-model="dialog.system.systemSort"  :min="1" :max="100" step-strictly controls-position="right" size="small"></el-input-number>
      </el-form-item>
      <el-form-item label="是否启用：" prop="isDelete">
        <el-switch v-model="dialog.system.isDelete"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitSystemForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {saveOrUpdateSystem} from "@/api/system";
  export default {
    name: 'UpdateDialog',
    data() {
      return {
        systemRules: {
          systemCode: [
            { required: true, message: '请输入系统编码', trigger: 'blur' }
          ],
          systemName: [
            { required: true, message: '输入系统名称', trigger: 'blur' }
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
       submitSystemForm() {
        this.$refs['systemRuleForm'].validate(async valid => {
          if (valid) {
            let params = {
              systemCode: this.dialog.system.systemCode,
              systemName: this.dialog.system.systemName,
              systemSort: this.dialog.system.systemSort,
              isDelete: this.dialog.system.isDelete
            }
            if (!_.isEmpty(this.dialog.system.id)) {
              params.id = this.dialog.system.id
            }
            let result = false;
            let res = await saveOrUpdateSystem(params)
            result = res.data
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
