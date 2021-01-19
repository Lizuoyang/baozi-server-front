<template>
  <el-dialog :title="dialog.title" :visible="dialog.visible" show-close width="30%" @close="dialog.visible = false">
    <el-form :model="dialog.material" :rules="materialRules" ref="materialRuleForm" label-width="100px">
      <el-form-item label="音频名称：" prop="title">
        <el-input v-model="dialog.material.title" clearable placeholder="文本名称" size="small" />
      </el-form-item>
      <el-form-item label="上传音频：" prop="linkUrl">
        <file-upload-ele :file-type="faileType" :default-file="dialog.material" :title="title" @remove="fatherMethod" @success="uploadFileSuccess"></file-upload-ele>
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
  import FileUploadEle from '@/components/EleUploadFile/index'
  export default {
    name: 'UpdateDialog',
    components: { FileUploadEle },
    data() {
      return {
        title:'上传音频',
        faileType:['mp3'],
        materialRules: {
          title: [
            { required: true, message: '请输入文本名称', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请上传音频文件', trigger: 'blur' }
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
      fatherMethod(){
        this.dialog.material.linkUrl = ''
        this.dialog.material.fileKey = ''
      },
      uploadFileSuccess(file){
        this.dialog.material.fileKey = file.fileKey
        this.dialog.material.content = file.fileName
        this.dialog.material.linkUrl = file.accessUrl
      },
      //修改 编辑
      submitMaterialForm() {
        this.$refs['materialRuleForm'].validate(async valid => {
          if (valid) {
            let params = {
              title: this.dialog.material.title,
              fileKey:  this.dialog.material.fileKey,
              linkUrl: this.dialog.material.linkUrl,
              content: this.dialog.material.content,
              corpId: this.currentCorp.id,
              type: 'voice',
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
              if (result){
                console.log("this.$refs[\"upload\"]",this.$refs["upload"].uploadImage)
                this.$refs["upload"].clearImage()
              }
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
