<template>
  <div class="home">
    <div id="demo1"></div>
  </div>

</template>

<script>
  import wangEditor from 'wangeditor'
  import request from '@/utils/request'
  export default {
    name: 'editorTemplate',
    data() {
      return {
        editor: null,
        editorData: ''

      }
    },
    mounted() {
      let editor = new wangEditor(`#demo1`)
      console.log(editor)
      editor.config.uploadImgParams = {
        type: 'image'
      },
      editor.config.pasteFilterStyle = false // 关闭掉粘贴样式的过滤
      editor.config.uploadImgServer = process.env.VUE_APP_BASE_API+'/api/material/upload/image'
      editor.config.uploadFileName = 'file'
      editor.config.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
          if (result.code === 200) {
            let url = result.data.accessUrl
            insertImg(url)
          } else {
            alert('上传图片出错')
          }
        }
      }
      // 配置 onchange 回调函数，将数据同步到 vue 中
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml
        this.$emit('editorContent', newHtml)
      }
      // 创建编辑器
      editor.create()
      this.editor = editor
    },
    methods: {
      setTxt(data){
        console.log(data)
        this.editor.txt.html(data)
      },
      clearTxt(){
        this.editor.txt.clear()
      }
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy()
      this.editor = null
    }
  }
</script>

<style lang="scss" scoped>

  .home {
     width: 1200px;
     margin: auto;
     position: relative;

      .btn {
       position: absolute;
       right: 0;
       top: 0;
       padding: 5px 10px;
       cursor: pointer;
    }

      h3 {
      margin: 30px 0 15px;
    }

  }
</style>
