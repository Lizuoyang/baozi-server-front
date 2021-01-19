<template>
  <el-dialog :title="dialog.title" :visible="dialog.visible" show-close width="30%" @close="dialog.visible = false">
    <el-form :model="dialog.material" :rules="materialRules" ref="materialRuleForm" label-width="100px">
      <el-form-item label="文本名称：" prop="title">
        <el-input v-model="dialog.material.title" clearable placeholder="文本名称" size="small" />
      </el-form-item>
      <el-form-item label="文本内容：" prop="content">
        <el-input size="medium" type="textarea" :rows="7" v-model="dialog.material.content" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitMaterialForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

  import { addMaterial } from "@/api/material";
  import { updateMaterial } from "@/api/material";
  import {mapGetters} from 'vuex'
  export default {
    name: 'UpdateDialog',
    data() {
      return {
        materialRules: {
          title: [
            { required: true, message: '请输入文本名称', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入文本内容', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentCorp',
        'user'
      ])
    },
    props: {
      dialog: {
        type: Object,
        default: null
      }
    },
    methods: {
      //修改 编辑
      submitMaterialForm() {
        this.$refs['materialRuleForm'].validate(async valid => {
          if (valid) {
            let params = {
              title: this.dialog.material.title,
              content: this.dialog.material.content,
              corpId: this.currentCorp.id,
              type: 'text',
              createdBy: this.user.loginName
            }
            let result = false;
            if (!_.isEmpty(this.dialog.material.id)) {
              params.id = this.dialog.material.id
              params.updatedBy = this.user.loginName
              let res = await updateMaterial(params)
              result = res.data
            } else {
              let res =await addMaterial(params)
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
