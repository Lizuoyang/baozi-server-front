<template>
  <div>
    <div class="dashboard-head">

    </div>
    <div class="dashboard-container">
      <el-form>
        <el-form-item label="文件上传:">
          <file-upload @success="uploadFileSuccess" ref="fileUpload"></file-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleFileUploadClear('fileUpload')">清除文件</el-button>
        </el-form-item>
        <el-form-item label="视频上传:">
          <video-upload @success="uploadVideoSuccess" ref="videoUpload"></video-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleFileUploadClear('videoUpload')">清除视频</el-button>
        </el-form-item>
        <el-form-item label="动态成员:" style="width: 500px">
          <department-tree-select @input="handleTreeSelectInput" :value="memberTreeValue" ></department-tree-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import FileUpload from '@/components/FileUpload'
  import VideoUpload from '@/components/VideoUpload'
  import DepartmentTreeSelect from '@/components/DepartmentTreeSelect'
  export default {
    name: "Example",
    data(){
      return {
        fileUrl: "",
        videoUrl: "",
        memberTreeValue: []
      }
    },
    methods: {
      handleTreeSelectInput(data) {
        console.log("选择的成员：", data)
      },
      handleFileUploadClear(fieldName) {
        this.$refs[fieldName].clearImage()
      },
      uploadFileSuccess(file){
        console.log("上传成功的文件：", file)
      },
      uploadVideoSuccess(file){
        console.log("上传成功的文件：", file)
      }
    },
    components: {
      DepartmentTreeSelect,
      FileUpload,
      VideoUpload
    }
  }
</script>

<style scoped>

</style>
