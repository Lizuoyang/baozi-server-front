<template>
  <ele-upload-video
    :action="actionUrl"
    :is-show-tip="isShowTip"
    :file-size="fileSize"
    :before-remove="handleBeforeRemove"
    @error="handleUploadError"
    :responseFn="handleResponse"
    :name="name"
    :width="width"
    :height="height"
    v-model="uploadVideo"
    :data="data"
    :file-type="fileType"
    :title="title"
  />
</template>

<script>
  import {removeUploadFile} from '@/api/material'
  import EleUploadVideo from "vue-ele-upload-video";
  export default {
    name: "VideoUpload",
    data(){
      return {
        uploadVideo: "",
        successOssFile: {}
      }
    },
    watch: {
      'defaultVideo'(val) {
        this.changData(val)
      },
    },
    methods: {
      changData(data) {
        if (data){
          console.log("data",data)
          this.uploadVideo = _.cloneDeep(data.linkUrl)
          this.successOssFile.fileKey = _.cloneDeep(data.fileKey)

        }
      },
      clearImage() {
        this.uploadVideo = ""
      },
      handleUploadError(error) {
        console.log("error", error);
      },
      async handleBeforeRemove(file, fileList) {
        let removeRes = await removeUploadFile(this.successOssFile.fileKey)
        return removeRes.data
      },
      handleResponse(response, file, fileList) {
        this.successOssFile = response
        this.$emit('success', this.successOssFile)
        return this.successOssFile.accessUrl;
      }
    },
    components: {
      EleUploadVideo
    },
    props: {
      defaultVideo: {
        type: Object,
        default: () => {}
      },
      title: {
        type: String,
        default: "视频上传"
      },
      // 上传地址
      actionUrl: {
        type: String,
        default: process.env.VUE_APP_BASE_API + '/api/material/upload/video'
      },
      // 值
      value: {
        type: String
      },
      // 响应处理函数
      responseFn: Function,
      // 文件大小限制(Mb)
      fileSize: {
        type: Number,
        default: 5
      },
      // 显示宽度(px)
      width: {
        type: Number,
        default: 360
      },
      // 显示高度(默认auto)
      height: {
        type: Number
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      },
      // 文件类型
      fileType: {
        type: Array,
        default: () => {
          return ['mp4']
        }
      },
      // 上传时附带的额外参数(同官网)
      data: {
        type: Object
      },
      // 上传的文件字段名 (同官网)
      name: {
        type: String,
        default: 'file'
      },
    }
  }
</script>

<style scoped>

</style>
