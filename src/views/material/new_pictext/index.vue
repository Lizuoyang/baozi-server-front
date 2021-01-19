<template>
  <el-card class="main_top">
    <el-container class="ptext_container" style="height: 100%;">
      <el-aside class="ptext_aside">
        <div>
          <div class="mini_titles_wrap" v-for="(item,index) in arrCurrentPicTextMsgs" :key="index">
            <div class="border-red" v-show="index == articlesIndex"></div>
            <div class="first_mini" v-if="index == 0" @click.stop="onePicText(index)">
              <img :src="item.picUrl" alt="" class="first_mini_title_img">
              <span class="s2" v-text="item.title"></span>
              <span class="layer-wrap">
                                <i class="el-icon-arrow-up" v-show="index != 0" @click.stop="toUp(index)"></i>
                                <i class="el-icon-arrow-down" v-show="index != (arrCurrentPicTextMsgs.length-1)" @click.stop="toDown(index)"></i>
                                <i class="el-icon-delete"  @click.stop="deleteSinglePicText(index)"></i>
                            </span>
            </div>
            <div class="mini_titles" v-else  @click.stop="onePicText(index)">
              <span class="s2" v-text="item.title"></span>
              <span class="s4"><img :src="item.picUrl" alt=""></span>
              <span class="layer-wrap">
                                <i class="el-icon-arrow-up" v-show="index != 0" @click.stop="toUp(index)"></i>
                                <i class="el-icon-arrow-down" v-show="index != (arrCurrentPicTextMsgs.length-1)" @click.stop="toDown(index)"></i>
                                <i class="el-icon-delete"  @click.stop="deleteSinglePicText(index)"></i>
                            </span>
            </div>
          </div>
          <div class="appmsg_menu_item_add">
            <el-button icon="el-icon-plus" class="btn-plus" @click="addPicTextMsg"></el-button>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-main class="ptext_main" v-show="showPtextMain">
          <el-form ref="form" :model="currentPicTextMsgs" label-width="100px" style="width: 900px;">
            <el-form-item label="标题：">
              <el-input v-model="currentPicTextMsgs.title" placeholder="请输入标题" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="摘要：">
              <el-input type="textarea" v-model="currentPicTextMsgs.description" placeholder="请输入摘要"
                        size="mini"></el-input>
            </el-form-item>
            <el-form-item label="封面图：">
              <file-upload @success="handleAvatarSuccess" ref="uploadImage"></file-upload>
            </el-form-item>
            <el-form-item label="图文详情：">
              <el-radio-group v-model="currentPicTextMsgs.type">
                <el-radio label="mpnews">正文</el-radio>
                <el-radio label="news">URL</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--      文件富文本-->
            <div v-show="currentPicTextMsgs.type == 'mpnews'" class="edit_container">
              <wang-editor ref="editor" @editorContent="getEditorContent"></wang-editor>
            </div>
            <el-form-item label="URL链接：" v-show="currentPicTextMsgs.type == 'news'">
              <el-input v-model="currentPicTextMsgs.url" placeholder="请输入链接" size="mini"></el-input>
            </el-form-item>
          </el-form>
        </el-main>
        <el-footer class="ptext_el_footer" style="height: 60px;background-color: #fff;">
          <div class="ptext_btn">
            <el-button type="primary" @click="save()">保存</el-button>
            <el-button type="danger" @click="cancel()">取消</el-button>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
  import WangEditor from "../../../components/Editor/editorTemplate";
  import { addMaterial } from '@/api/material'
  import { updateMaterial } from '@/api/material'
  import { mapGetters } from 'vuex'
  import FileUpload from '@/components/FileUpload'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  export default {
    data() {
      return {
        defImage: {

        },
        delArticles: [],//删除文章的id
        state:'',
        editorData: "",
        articlesIndex: 0,//当前显示文章索引 默认0
        rowid: "",//编辑时用到的数据id
        defaultImage: '',
        showPtextMain: false,//是否显示右边编辑框
        addForm: {
          type: 'news'//后台默认参数，区分其他素材
        },
        currentPicTextMsgs: {
          title: '',
          description: '',
          picUrl: '',
          type: 'mpnews',
          content: '',
          url: '',
          fileKey: ''
        },
        arrCurrentPicTextMsgs: [],//多条内容,数组
        content: '',
        editorOption: {}

      }
    },
    mounted() {
      let currentData = this.$route.query.picText
      if (currentData != null){
        this.state = 'update'
        let picTextValue = currentData
        if(picTextValue && picTextValue.type == "news"){    //修改
          this.arrCurrentPicTextMsgs = picTextValue.articles
          this.rowid = picTextValue.id
          this.currentPicTextMsgs = this.arrCurrentPicTextMsgs[0]
          //this.showPtextMain = true
          this.$refs.uploadImage.setData(this.currentPicTextMsgs.picUrl,this.currentPicTextMsgs.fileKey)
          this.$refs.editor.setTxt(this.currentPicTextMsgs.content)
        }
      }else{  //新增
        this.state = 'add'
        this.arrCurrentPicTextMsgs.push(this.currentPicTextMsgs)
      }
      this.showPtextMain = true
    },
    beforeDestroy() {
      //这个必须要加，不然初始化的时候会有问题
      // this.$tinymce.remove()
    },
    components: {
      FileUpload,
      WangEditor
    },
    computed: {
      ...mapGetters([
        'currentCorp',
        'user'
      ]),
    },
    watch: {
      // 'currentPicTextMsgs.content'(val){
      //   if (val){
      //     this.$refs.editor.setData(val)
      //   }
      // }
    },
    methods: {
      cancel(){
        this.$router.push({path:'/material/pictext'})
      },
      swapArr(arr, index1, index2) {
        //交换位置
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        //记录当前显示文章的索引
        if(this.articlesIndex == index1){
          this.articlesIndex = index2
        }else if(this.articlesIndex == index2){
          this.articlesIndex = index1
        }
      },
      toDown(index) {  //向下移
        let currIndex = index
        let targetIndex = index + 1

        this.swapArr(this.arrCurrentPicTextMsgs, currIndex, targetIndex)
      },
      toUp(index) {    //向上移
        let currIndex = index
        let targetIndex = index - 1
        this.swapArr(this.arrCurrentPicTextMsgs, currIndex, targetIndex)
      },
      onePicText(i){ //点击显示文本数据
        //console.log("onePicText",i)
        this.saveCurrArticle()
        this.articlesIndex = i
        this.currentPicTextMsgs = this.arrCurrentPicTextMsgs[i]
        this.showPtextMain = true
        console.log("this.currentPicTextMsgs",this.currentPicTextMsgs)
        this.$refs.uploadImage.setData(this.currentPicTextMsgs.picUrl,this.currentPicTextMsgs.fileKey)
        this.$refs.editor.setTxt(this.currentPicTextMsgs.content)
        //this.editor.txt.html(this.currentPicTextMsgs.content)
      },
      getEditorContent(data) {
        this.currentPicTextMsgs.content = data
      },

      saveCurrArticle() { //保存当前编辑的一条
        //this.currentPicTextMsgs.content = this.$refs.myQuillEditor.value
        this.arrCurrentPicTextMsgs[this.articlesIndex] = this.currentPicTextMsgs
      },
      addPicTextMsg() {   //新增一条
        if (!this.currentPicTextMsgs.title || !this.currentPicTextMsgs.picUrl) {
          this.$notify({
            title: '警告',
            message: '请完善图文名称或封面图',
            type: 'warning'
          })
          return
        }
        if (!this.currentPicTextMsgs.content) {
          this.$notify({
            title: '警告',
            message: '请填写正文',
            type: 'warning'
          })
          return
        }
        this.articlesIndex = this.arrCurrentPicTextMsgs.length - 1
        this.saveCurrArticle()
        this.$refs.editor.clearTxt()
        this.currentPicTextMsgs = {
          title: '',
          description: '',
          picUrl: '',
          type: 'mpnews',
          content: '',
          url: '',
          fileKey: ''
        }
        this.arrCurrentPicTextMsgs.push(this.currentPicTextMsgs)
        this.articlesIndex = this.arrCurrentPicTextMsgs.length - 1
        this.$refs.uploadImage.clearImage()
      },
      handleAvatarSuccess(file) {
        this.currentPicTextMsgs.picUrl = file.accessUrl
        this.currentPicTextMsgs.fileKey = file.fileKey
      },
      async save() {
        if (!this.currentPicTextMsgs.title || !this.currentPicTextMsgs.picUrl) {
          this.$notify({
            title: '警告',
            message: '请完善图文名称或封面图',
            type: 'warning'
          })
          return
        }
        this.articlesIndex = this.arrCurrentPicTextMsgs.length - 1
        this.saveCurrArticle()
        this.addForm.articles = this.arrCurrentPicTextMsgs
        this.addForm.corpId = this.currentCorp.id
        this.addForm.createdBy = this.user.loginName
        this.addForm.articles.forEach((elem, i) => { //给文章加顺序
          elem.articleOrder = i
        })
        if (this.state == 'add'){
          let res =await addMaterial(this.addForm)
          if (res.data){
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.$router.push({path:'/material/pictext'})
          }else {
            this.$message({
              type: 'error',
              message: '编辑失败!'
            });
          }
        }
        if (this.state == 'update'){
          this.addForm.updatedBy = this.user.loginName
          this.addForm.id = this.rowid
          if(this.delArticles.length != 0){
            this.addForm.delArticles = this.delArticles
          }
          let res =await updateMaterial(this.addForm)
          console.log("res",res)
          if (res.data){
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.$router.push({path:'/material/pictext'})
          }else {
            this.$message({
              type: 'error',
              message: '编辑失败!'
            });
          }
        }

      },
      close() {
        app.closeCurrentTagNav()
      },
      deleteSinglePicText(i) {
        if (this.arrCurrentPicTextMsgs.length > 1) {
          let delArticlesId = this.arrCurrentPicTextMsgs[i].id
          this.delArticles.push(delArticlesId)
          this.arrCurrentPicTextMsgs.splice(i, 1)
        }
      }

    }
  }
</script>

<style scoped>
  .ptext_aside {
    background-color: #8c939d;
  }

  .main_top {
    padding-top: 30px;
  }

  .mini_titles_wrap {
    position: relative;
    width: 300px;
    height: 60px;
    overflow: hidden;
    padding-top: 1px;
  }

  .mini_titles_wrap:first-child {
    height: 120px;
  }

  .mini_titles_wrap .border-red {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #f05654;
  }

  .mini_titles_wrap .layer-wrap {
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    overflow: hidden;
    color: #fff;
    font-size: 20px;
    visibility: hidden;
  }

  .mini_titles_wrap:hover .layer-wrap {
    visibility: visible;
  }

  .mini_titles_wrap .layer-wrap .iconfont {
    position: absolute;
    width: 20px;
    top: -14px;
    cursor: pointer;
  }

  .mini_titles_wrap .first_mini .layer-wrap .iconfont {
    top: 4px;
  }

  .mini_titles_wrap .layer-wrap .icon1 {
    left: 20px;
  }

  .mini_titles_wrap .layer-wrap .icon2 {
    left: 60px;
  }

  .mini_titles_wrap .layer-wrap .icon3 {
    right: 20px;
  }

  .first_mini {
    width: 298px;
    height: 118px;
    background-color: #fff;
    font-size: 14px;
    text-align: center;
    margin-bottom: 4px;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }

  .first_mini .first_mini_title_img {
    width: 100%;
  }

  .first_mini .s2 {
    position: absolute;
    width: 98%;
    height: 30px;
    line-height: 30px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 16px;
    color: #fff;
    font-size: 28px;
    white-space: nowrap;
    overflow: hidden;
  }

  .mini_titles_wrap .first_mini .layer-wrap .iconfont {
    top: 4px;
  }

  .ptext_main {
    /*padding-top: 2px;*/

    background-color: #FFFFFF;
  }

  /*不可点击*/
  .ptext_main_none {
    pointer-events: none;
    background-color: #e4e6e8;
  }

  .ptext_main_none div {
    font-size: 24px;
    text-align: center;
    color: #acaeb3;
    line-height: 500px;
  }

  .ptext_el_footer {
    /*height: 107px;*/
    text-align: center;
    margin-left: 2%;
    background-color: rgba(235, 246, 251, 1);
  }

  /*.appmsg_menu{*/
  /*width: 300px;*/
  /*height: 300px;*/
  /*}*/
  .appmsg_menu_item {
    width: 300px;
    height: 180px;
    margin: 5px 0px 15px 0px;
    border-bottom: solid 2px #acdbf6;
  }

  .appmsg_menu_item_span_first {
    margin: 0 auto;
    width: 100%;
    height: 80%;
  }

  .appmsg_menu_item_span_first img {
    margin: auto;
    height: 90%;
    width: 100%;
  }

  .first_img_span {
    display: inline-block;
    margin: 5px auto;
    height: 90%;
    width: 100%;
    background-color: #8c939d;
  }

  .appmsg_menu_item_span_first strong {
    position: absolute;
    left: 32px;
    bottom: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #fff;
    font-weight: 400;
    z-index: 1;
  }

  .appmsg_menu_item_span_common {
    line-height: 60px;
  }

  .appmsg_menu_item_span_common label {
    position: absolute;
    left: 32px;
    bottom: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #fff;
    font-weight: 400;
    z-index: 1;
  }

  .appmsg_menu_item_span_common img {
    width: 100%;
    height: 90%;
  }

  .common_img_span {
    display: inline-block;
    width: 100%;
    height: 90%;
    background-color: #8c939d;
  }

  .appmsg_menu_item_add {
    width: 299px;
    height: 60px;
    margin: 5px 0px 15px 0px;
    text-align: center;
    line-height: 40px;
  }

  .appmsg_menu_item_add .ptext_plus {
    line-height: 30px;
  }

  .ptext_footer {
    margin-top: 10px;
    height: 160px;
  }

  .ptext_btn {
    margin-top: 10px;
  }

  .btn-plus {
    width: 100%;
    border: 0px;
    line-height: inherit;
    color: #acdbf6;
    font-size: 25px;
  }

  .ptext_msg_head {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .ptext_msg_head span {
    width: 40%;
    display: inline-block;
  }

  .ptext_yuanwen {
    margin-top: 20px;
  }

  .pinpai_cls input {
    height: 28px !important;
  }

  /*图片上传样式*/
  .avatar-uploader .el-upload {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    float: left;
    margin: 0 7px 0 7px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 14px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .img-tip {
    color: #f05654;
  }

  .avatar-uploader .el-upload {
    float: none;
  }

  textarea[name="editorValue"] {
    display: none;
  }

  .mini_titles {
    width: 298px;
    height: 58px;
    background-color: #fff;
    display: flex;
    font-size: 14px;
    text-align: center;
    line-height: 60px;
    margin-bottom: 4px;
    position: relative;
    margin: 0 auto;
  }

  .mini_titles_wrap {
    position: relative;
    width: 300px;
    height: 60px;
    overflow: hidden;
    padding-top: 1px;
  }

  .mini_titles_wrap:first-child {
    height: 120px;
  }

  .mini_titles_wrap .border-red {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #f05654;
  }

  .mini_titles_wrap .layer-wrap {
    position: absolute;
    width: 100%;
    height: 30px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    overflow: hidden;
    color: #fff;
    font-size: 20px;
    visibility: hidden;
  }

  .mini_titles_wrap:hover .layer-wrap {
    visibility: visible;
  }

  .mini_titles_wrap .layer-wrap .iconfont {
    position: absolute;
    width: 20px;
    top: -14px;
    cursor: pointer;
  }

  .mini_titles_wrap .first_mini .layer-wrap .iconfont {
    top: 4px;
  }

  .mini_titles_wrap .layer-wrap .icon1 {
    left: 20px;
  }

  .mini_titles_wrap .layer-wrap .icon2 {
    left: 60px;
  }

  .mini_titles_wrap .layer-wrap .icon3 {
    right: 20px;
  }

  .mini_titles .s2 {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
  }

  .mini_titles .s4 {
    width: 20%;
    overflow: hidden;
  }

  .mini_titles .s4 img {
    width: 100%;
  }

  .first_mini {
    width: 298px;
    height: 118px;
    background-color: #fff;
    font-size: 14px;
    text-align: center;
    margin-bottom: 4px;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }

  .first_mini .first_mini_title_img {
    width: 100%;
  }

  .first_mini .s2 {
    position: absolute;
    width: 98%;
    height: 30px;
    line-height: 30px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 16px;
    color: #fff;
    font-size: 28px;
    white-space: nowrap;
    overflow: hidden;
  }

  .avatar {
    width: 100%;
    height: 100%;
  }

  .avatar-uploader {
    display: inline-block;
  }
</style>
