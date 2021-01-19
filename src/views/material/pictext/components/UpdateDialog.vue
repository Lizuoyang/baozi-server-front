<template>
  <el-dialog :title="dialog.title" :visible="dialog.visible" show-close width="80%" @close="dialog.visible = false">
    <el-container>
      <el-aside width="300px" style="background-color: red">
        aside
      </el-aside>
      <el-main>
        <el-form ref="form" :model="currentPicTextMsgs" label-width="100px">
          <el-form-item label="标题：">
            <el-input v-model="currentPicTextMsgs.title" placeholder="请输入标题" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="摘要：">
            <el-input type="textarea" v-model="currentPicTextMsgs.description" placeholder="请输入摘要"
                      size="mini"></el-input>
          </el-form-item>
          <el-form-item label="封面图：">
            <file-upload></file-upload>
          </el-form-item>
          <el-form-item label="图文详情：">
            <el-radio-group v-model="currentPicTextMsgs.type">
              <el-radio label="mpnews">正文</el-radio>
              <el-radio label="news">URL</el-radio>
            </el-radio-group>
          </el-form-item>
          <!--      文件-->
          <div v-show="currentPicTextMsgs.type == 'mpnews'">
            <template>
              <div>
                <editor-bar v-model="detail" :isClear="isClear" @change="change"></editor-bar>
              </div>
            </template>
          </div>
          <el-form-item label="URL链接：" v-show="currentPicTextMsgs.type == 'news'">
            <el-input v-model="currentPicTextMsgs.url" placeholder="请输入链接" size="mini"></el-input>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <!--    <div>-->
    <!--      <el-container class="ptext_container" style="height: 100%;">-->
    <!--        <el-aside class="ptext_aside">-->
    <!--          <div>-->
    <!--            <div class="mini_titles_wrap" v-for="(item,index) in arrCurrentPicTextMsgs" :key="index">-->
    <!--              <div class="border-red" v-show="index == articlesIndex"></div>-->
    <!--              <div class="first_mini" v-if="index == 0" @click.stop="onePicText(index)">-->
    <!--                <img :src="item.picUrl" alt="" class="first_mini_title_img">-->
    <!--                <span class="s2" v-text="item.title"></span>-->
    <!--                <span class="layer-wrap">-->
    <!--                                <i class="icon1 iconfont icon-shang" v-show="index != 0" @click.stop="toUp(index)"></i>-->
    <!--                                <i class="icon2 iconfont icon-icon-arrow-bottom2" v-show="index != (arrCurrentPicTextMsgs.length-1)" @click.stop="toDown(index)"></i>-->
    <!--                                <i class="icon3 iconfont icon-shanchu" @click.stop="deleteSinglePicText(index)"></i>-->
    <!--                            </span>-->
    <!--              </div>-->
    <!--              <div class="mini_titles" v-else  @click.stop="onePicText(index)">-->
    <!--                <span class="s2" v-text="item.title"></span>-->
    <!--                <span class="s4"><img :src="item.picUrl" alt=""></span>-->
    <!--                <span class="layer-wrap">-->
    <!--                                <i class="icon1 iconfont icon-shang" v-show="index != 0" @click.stop="toUp(index)"></i>-->
    <!--                                <i class="icon2 iconfont icon-icon-arrow-bottom2" v-show="index != (arrCurrentPicTextMsgs.length-1)" @click.stop="toDown(index)"></i>-->
    <!--                                <i class="icon3 iconfont icon-shanchu" @click.stop="deleteSinglePicText(index)"></i>-->
    <!--                            </span>-->
    <!--              </div>-->
    <!--            </div>-->
    <!--            <div class="appmsg_menu_item_add">-->
    <!--              <el-button icon="el-icon-plus" class="btn-plus" @click="addPicTextMsg"></el-button>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-aside>-->
    <!--        <el-container>-->
    <!--          <el-main class="ptext_main" v-show="showPtextMain">-->
    <!--            <el-form ref="form" :model="currentPicTextMsgs" label-width="100px" style="width: 900px;">-->
    <!--              <el-form-item label="标题：">-->
    <!--                <el-input v-model="currentPicTextMsgs.title" placeholder="请输入标题" size="mini"></el-input>-->
    <!--              </el-form-item>-->
    <!--              <el-form-item label="摘要：">-->
    <!--                <el-input type="textarea" v-model="currentPicTextMsgs.description" placeholder="请输入摘要" size="mini"></el-input>-->
    <!--              </el-form-item>-->
    <!--              <el-form-item label="封面图：">-->
    <!--                <img v-if="currentPicTextMsgs.picUrl" :src="currentPicTextMsgs.picUrl" width="100" height="100">-->
    <!--                <el-upload-->
    <!--                  class="avatar-uploader"-->
    <!--                  action="/upload/image"-->
    <!--                  :show-file-list="false"-->
    <!--                  :on-success="handleAvatarSuccess"-->
    <!--                  :before-upload="beforeAvatarUpload">-->
    <!--                  <i class="el-icon-plus avatar-uploader-icon"></i>-->
    <!--                </el-upload>-->
    <!--                <p class="img-tip">支持JPG、PNG格式，大图 1068*455，小图150*150，且图片大小不超过2M</p>-->
    <!--              </el-form-item>-->
    <!--              <el-form-item label="图文详情：">-->
    <!--                <el-radio-group v-model="currentPicTextMsgs.type">-->
    <!--                  <el-radio label="mpnews">正文</el-radio>-->
    <!--                  <el-radio label="news">URL</el-radio>-->
    <!--                </el-radio-group>-->
    <!--              </el-form-item>-->
    <!--              <div v-show="currentPicTextMsgs.type == 'mpnews'">-->
    <!--                <div id="picTextContent"></div>-->
    <!--              </div>-->
    <!--              <el-form-item label="URL链接："  v-show="currentPicTextMsgs.type == 'news'">-->
    <!--                <el-input v-model="currentPicTextMsgs.url" placeholder="请输入链接" size="mini"></el-input>-->
    <!--              </el-form-item>-->
    <!--            </el-form>-->
    <!--            <el-footer class="ptext_el_footer" style="height: 60px;background-color: #fff;">-->
    <!--              <div class="ptext_btn">-->
    <!--                <el-button type="primary" @click="save">保存</el-button>-->
    <!--                <el-button type="danger" @click="close">取消</el-button>-->
    <!--              </div>-->
    <!--            </el-footer>-->
    <!--          </el-main>-->
    <!--        </el-container>-->
    <!--      </el-container>-->
    <!--    </div>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitMaterialForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import FileUpload from '@/components/FileUpload'
  import { addMaterial } from '@/api/material'
  import { updateMaterial } from '@/api/material'
  import { mapGetters } from 'vuex'

  export default {
    name: 'UpdateDialog',
    data() {
      return {
        isClear: false,
        detail:"",
        currentPicTextMsgs: {
          title: '',
          description: '',
          picUrl: '',
          type: 'mpnews',
          content: '',
          url: '',
          fileKey: ''
        },
        articlesIndex: 0,//当前显示文章索引 默认0
        showPtextMain: false,//是否显示右边编辑框
        arrCurrentPicTextMsgs: [],//多条内容,数组
        uploadImage: '',
        materialRules: {
          title: [
            { required: true, message: '请输入图片名称', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请上传图片', trigger: 'blur' }
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
    components: {
      FileUpload
    },
    // created() {
    //   this.init()
    // },
    methods: {
      // init(){
      //   let E = window.wangEditor
      //   this.editor = new E('#picTextContent')
      //   this.editor.customConfig.uploadImgParams = {
      //     type: 'image'
      //   }
      //   this.editor.customConfig.pasteFilterStyle = false // 关闭掉粘贴样式的过滤
      //   this.editor.customConfig.uploadImgServer = '/upload/image'
      //   this.editor.customConfig.uploadFileName = 'file'
      //   this.editor.create()
      //
      // },
      change(val) {
        console.log(val)

      },
      onePicText(i) { //点击显示文本数据
        this.saveCurrArticle()
        this.articlesIndex = i
        this.currentPicTextMsgs = this.arrCurrentPicTextMsgs[i]
        this.showPtextMain = true
        this.editor.txt.html(this.currentPicTextMsgs.content)
      },
      saveCurrArticle() { //保存当前编辑的一条
        this.currentPicTextMsgs.content = this.editor.txt.html()
        this.arrCurrentPicTextMsgs[this.articlesIndex] = this.currentPicTextMsgs
      },
      close() {
        app.closeCurrentTagNav()
      },
      save() {
        this.addForm.corpId = this.corpId
        if (this.pageType == 'add') {
          if (!this.currentPicTextMsgs.title || !this.currentPicTextMsgs.picUrl) {
            App.warning('请完善图文名称或封面图')
            return
          }
          this.saveCurrArticle()
          this.addForm.articles = this.arrCurrentPicTextMsgs
          this.addForm.articles.forEach((elem, i) => { //给文章加顺序
            elem.articleOrder = i
          })

          app.request('/api/work-weixin/material/add').post().setData(this.addForm).callSuccess(() => {
            App.success('添加成功')
            app.closeCurrentTagNav()
          })
        } else if (this.pageType == 'edit' && this.rowid) {
          this.saveCurrArticle()
          this.addForm.articles = this.arrCurrentPicTextMsgs
          this.addForm.articles.forEach((elem, i) => { //给文章加顺序
            elem.articleOrder = i
          })
          this.addForm.id = this.rowid
          if (this.delArticles.length != 0) {
            this.addForm.delArticles = this.delArticles
          }
          app.request('/api/work-weixin/material/update').post().setData(this.addForm).callSuccess(() => {
            App.success('修改成功')
            app.closeCurrentTagNav()
          })
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG && !isPNG) {
          this.$message.error('图片只能是 JPG 或 PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!')
        }
        if ((isJPG || isPNG) && isLt2M) {
          this.$message.success('封面图上传成功')
        }
        return (isJPG || isPNG) && isLt2M
      },
      handleAvatarSuccess(res, file) {
        this.currentPicTextMsgs.picUrl = res.data.accessUrl
        this.currentPicTextMsgs.fileKey = res.data.fileKey
      },
      addPicTextMsg() {   //新增一条
        if (this.pageType == 'add' && (!this.currentPicTextMsgs.title || !this.currentPicTextMsgs.picUrl)) {
          App.warning('请完善图文名称或封面图')
          return
        }
        if (this.arrCurrentPicTextMsgs.length >= 8) {
          App.warning('最多添加八篇文章')
          return
        }
        this.saveCurrArticle()
        if (this.editor.txt.html()) {
          this.editor.txt.clear()
        }
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
      },
      fatherMethod(file) {
        this.dialog.material.linkUrl = ''
      },
      uploadFileSuccess(file) {
        this.dialog.material.fileKey = file.fileKey
        this.dialog.material.linkUrl = file.accessUrl
      },
      //新增 编辑
      submitMaterialForm() {
        this.$refs['materialRuleForm'].validate(async valid => {
          if (valid) {
            let params = {
              title: this.dialog.material.title,
              fileKey: this.dialog.material.fileKey,
              linkUrl: this.dialog.material.linkUrl,
              corpId: this.currentCorp.id,
              type: 'image',
              createdBy: this.user.loginName
            }
            let result = false
            if (!_.isEmpty(this.dialog.material.id)) {
              params.id = this.dialog.material.id
              params.updatedBy = this.user.loginName
              let res = await updateMaterial(params)
              result = res.data
            } else {
              let res = await addMaterial(params)
              result = res.data
              if (result) {
                console.log('this.$refs["upload"]', this.$refs['upload'].uploadImage)
                this.$refs['upload'].clearImage()
              }
            }
            this.dialog.visible = !result
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
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
