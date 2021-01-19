<!--<template>-->
<!--  <ele-upload-image-->
<!--    :action="actionUrl"-->
<!--    :fileType="fileType"-->
<!--    :fileSize="fileSize"-->
<!--    :thumbSuffix="thumbSuffix"-->
<!--    :drag="drag"-->
<!--    :name="name"-->
<!--    :data="data"-->
<!--    :title="title"-->
<!--    :lazy="lazy"-->
<!--    :size="size"-->
<!--    :isShowTip="isShowTip"-->
<!--    :beforeRemove="handleBeforeRemove"-->
<!--    v-model="uploadImage"-->
<!--    :responseFn="handleResponse"-->
<!--  ></ele-upload-image>-->
<!--</template>-->
<template>
  <ele-upload-file
    :responseFn="handleResponse"
    :action="actionUrl"
    v-model="uploadFile"
    :title="title"
    :limit="1"
    :file-type="fileType"
    :isShowSize="true"
    :beforeRemove="handleBeforeRemove"
    :isShowTip="isShowTip"
    :placeholder="placeholder"
  />
</template>

<script>
  import { removeUploadFile } from '@/api/material'
  import EleUploadFile from "vue-ele-upload-file";

  export default {
    name: 'FileUploadEle',
    components: {
      EleUploadFile
    },
    data() {
      return {
        uploadFile: '',
        successOssFile: {}
      }
    },
    props: {
      placeholder:{
        type: String,
        default: '文件上传'
      },
      // 默认图片
      defaultFile: {
        type: Object,
        default: () => {}
      },
      // 弹窗标题
      title: {
        type: String,
        default: '文件上传'
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      },
      // 图片显示大小
      size: {
        type: Number,
        default: 100
      },
      // 上传地址
      actionUrl: {
        type: String,
        default: process.env.VUE_APP_BASE_API + '/api/material/upload/file'
      },
      // 图片后缀
      thumbSuffix: {
        type: String,
        default: ''
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 5
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => {
          return ['doc', 'zip','rar','xls','xlsx','pdf','ppt','pptx']
        }
      },
      // 是否启用拖拽上传 (同官网)
      drag: {
        type: Boolean,
        default: false
      },
      // 图片懒加载
      lazy: {
        type: Boolean,
        default: false
      },
      // 上传时附带的额外参数(同官网)
      data: Object,
      // 上传的文件字段名 (同官网)
      name: {
        type: String,
        default: 'file'
      }
    },
    watch: {
      'defaultFile'(val) {
        this.changData(val)
      },
    },
    created() {
      this.changData(this.defaultFile)
    },
    methods: {
      changData(data) {
        if (data){
          this.uploadFile = _.cloneDeep(data.linkUrl)
          this.successOssFile.fileKey = _.cloneDeep(data.fileKey)

        }
      },
      clearImage() {
        this.uploadFile = ''
      },
      assignImage(val) {
        this.uploadFile = val
      },
       handleBeforeRemove(file, fileList) {
          if (this.successOssFile.fileKey){
            let removeRes =  removeUploadFile(this.successOssFile.fileKey)
            this.$emit("remove",this.uploadImage)
            return removeRes.data
          }else {
            return false
          }



      },
      handleResponse(response, file, fileList) {
        this.successOssFile = response
        this.$emit('success', this.successOssFile)
        return this.successOssFile.accessUrl
      }
    }
  }
</script>

<style scoped>

</style>
