<template>
  <ele-upload-image
    :action="actionUrl"
    :fileType="fileType"
    :fileSize="fileSize"
    :thumbSuffix="thumbSuffix"
    :drag="drag"
    :name="name"
    :data="data"
    :title="title"
    :lazy="lazy"
    :size="size"
    :clearImage="clearImage"
    :isShowTip="isShowTip"
    :beforeRemove="handleBeforeRemove"
    v-model="uploadImage"
    :responseFn="handleResponse"
  ></ele-upload-image>
</template>
<script>
  import { removeUploadFile } from '@/api/material'
  import EleUploadImage from 'vue-ele-upload-image'

  export default {
    name: 'FileUpload',
    components: {
      EleUploadImage
    },
    data() {
      return {
        uploadImage: '',
        successOssFile: {}
      }
    },
    props: {
      // 默认图片
      defaultImage: {
        type: Object,
        default: () => {}
      },
      // 弹窗标题
      title: {
        type: String,
        default: '图片上传'
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
        default: process.env.VUE_APP_BASE_API + '/api/material/upload/image'
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
          return ['jpg', 'png']
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
      'defaultImage'(val) {
        this.changData(val)
      },
    },
    created() {
      this.changData(this.defaultImage)
    },
    methods: {
      setData(linkUrl,fileKey){
        if (linkUrl){
          this.uploadImage = _.cloneDeep(linkUrl)
        }
        if (fileKey){
          this.successOssFile.fileKey = _.cloneDeep(fileKey)
        }
      },
      changData(data) {
        if (data){
           this.uploadImage = _.cloneDeep(data.linkUrl)
           this.successOssFile.fileKey = _.cloneDeep(data.fileKey)

        }
      },
      clearImage() {
        this.uploadImage = ''
      },
      assignImage(val) {
        this.uploadImage = val
      },
       handleBeforeRemove(file, fileList) {
          if (this.successOssFile.fileKey){
            let removeRes =  removeUploadFile(this.successOssFile.fileKey)
            this.$emit("remove",this.uploadImage)
            return removeRes.data
          }else {
            return true
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
