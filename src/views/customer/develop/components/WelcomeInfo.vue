<template>
  <el-dialog :title="title" :visible.sync="welcomeDilog" show-close width="40%" top="20vh">
    <el-form style="width: 450px" v-model="modal" ref="modalForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="发送范围:" v-if="welcomeType==0">
        <el-select style="width:350px" multiple filterable allow-create default-first-option placeholder="请选择"
                   v-model="stateNameList"
                   ref="selectItemList" @change="selectItemList(stateNameList)">
          <el-option v-for="item in ChannelList" :label="item.stateName" :value="item.stateId" :key="item.stateId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息内容:">
        <el-input type="textarea" :rows="5" placeholder="请编辑素材内容" v-model="content"/>
        <el-button style="margin-top:5px" type="info" plain size='mini' @click='materialShow()'>请选择素材</el-button>
      </el-form-item>
      <el-form-item label="素材类型">
        <el-radio-group v-model="type" size="mini" style="margin-top:10px">
          <el-radio :label="0">文本</el-radio>
          <el-radio :label="1">小程序</el-radio>
          <el-radio :label="2">图片</el-radio>
          <el-radio :label="3">网页</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="type!=0">
        <el-form-item label="选择图片:">
          <div class="bg_image" @click="btnImage()">
            <el-image class="image" :src="imageSrc">
              <div slot="error" class="image-slot">
                点击请选择
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </el-form-item>
      </div>
      <div v-if="type==1">
        <el-form-item label="小程序标题:">
          <el-input style="width:350px" v-model="modal.miniProgram.title" placeholder="小程序标题" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="小程序appId:">
          <el-input style="width:350px" v-model="modal.miniProgram.appid" placeholder="小程序appId" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="小程序路径:">
          <el-input style="width:350px" v-model="modal.miniProgram.page" placeholder="小程序路径" size="mini">
          </el-input>
        </el-form-item>
      </div>
      <div v-if="type==3">
        <el-form-item label="网页标题:">
          <el-input style="width:350px" v-model="modal.link.title" placeholder="请输入标题" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="网页描述:">
          <el-input style="width:350px" v-model="modal.link.desc" placeholder="网页描述" size="mini">
          </el-input>
        </el-form-item>
        <el-form-item label="网页链接:">
          <el-input style="width:350px" v-model="modal.link.url" placeholder="请输入网页链接" size="mini">
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="welcomeDilog= false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submit" icon="el-icon-circle-check">确 定</el-button>
      </span>
  </el-dialog>


</template>


<script>
  import store from '@/store'
  import {getStateList, addWelcome, updateWelcome, addDefaultWelcome} from '@/api/develop'

  export default {
    name: 'WelcomeInfo',
    data() {
      return {
        welcomeDilog: false,
        ChannelList: [],
        stateNameList: [],
        fileKey: '',
        imageSrc: '',
        type: 0,
        content: '',
        modal: {
          miniProgram: {
            title: ''
          },
          link: {},
        },
      }
    },
    props: {
      'title': String,
      'welcomeType': 0,
    },
    created() {

    },
    methods: {
      //显示对话框
      showDialog(data) {
        this.welcomeDilog = true;
        if (data == undefined) {
          this.stateNameList = [];
          this.imageSrc = '';
          this.type = 0;
          this.modal = {
            stateIds: [],
            content: '',
            miniProgram: {
              title: ''
            },
            image: {
              fileKey: '',
              picUrl: '',
            },
            link: {},

          };
        } else {
          if (data.type == 1) {
            this.imageSrc = data.miniProgram.picUrl;
            this.fileKey = data.miniProgram.fileKey;
            this.modal.miniProgram = data.miniProgram;
            this.modal.image = {picUrl: '', fileKey: ''};
            this.modal.link = {};
          } else if (data.type == 2) {
            this.imageSrc = data.image.picUrl;
            this.fileKey = data.image.fileKey;
            this.modal.image = data.image;
            this.modal.miniProgram = {};
            this.modal.link = {};
          } else if (data.type == 3) {
            this.imageSrc = data.link.picUrl;
            this.fileKey = data.link.fileKey;
            this.modal.link = data.link;
            this.modal.miniProgram = {};
            this.modal.image = {picUrl: '', fileKey: ''};
          }
          this.stateNameList = [];
          this.modal.stateIds = [];
          for (var i = 0; i < data.states.length; i++) {
            this.stateNameList.push(data.states[i].stateId);
            this.modal.stateIds.push(data.states[i].stateId)
          }
          this.modal.id = data.id;
          this.modal.content = data.content;
          this.modal.corpId = data.corpId;
          this.content = data.content;
          this.type = data.type;
        }
        this.getState();
      },

      //获取已选择的文本元素
      getTextDate(content) {
        this.modal.content = content;
        this.content = content;

      },
      //获取已选择的图片
      getPic(data) {
        this.imageSrc = data.linkUrl;
        this.fileKey = data.fileKey;
      },

      //获取渠道列表
      getState() {
        let parme = {
          corpId: store.getters.currentCorp.id,
          pageSize: 1000,
          pageNum: 1,
        }
        getStateList(parme).then(response => {
          console.log(response);
          this.ChannelList = response.list;
        })
      },
      //欢迎语选择渠道
      selectItemList(val) {
        this.modal.stateIds = val;
      },
      //选择文本素材
      materialShow() {
        this.$emit("getTextBtn");
      },
      //选择图片
      btnImage() {
        this.$emit("getBtnImage");
      },
      //提交
      submit() {
        this.modal.type = this.type;
        if (this.modal.stateIds.length == 0 && this.welcomeType == 0) {
          this.$message({message: '请选择发送范围', showClose: true, type: 'error'})
          return;
        }
        if (this.modal.content === '' || this.modal.content == undefined) {
          this.$message({message: '请添加文本素材', showClose: true, type: 'error'})
          return;
        }
        if (this.modal.type == 1) {
          if (this.imageSrc === '' || this.imageSrc == undefined) {
            this.$message({message: '请添加图片', showClose: true, type: 'error'})
            return;
          }
          this.modal.miniProgram.fileKey = this.fileKey;
          this.modal.miniProgram.picUrl = this.imageSrc;
          if (this.modal.miniProgram.title == '' || this.modal.miniProgram.title == undefined) {
            this.$message({message: '请添加小程序标题', showClose: true, type: 'error'})
            return;
          }
          if (this.modal.miniProgram.appid == '' || this.modal.miniProgram.appid == undefined) {
            this.$message({message: '请添加小程序APPID', showClose: true, type: 'error'})
            return;
          }
          if (this.modal.miniProgram.page == '' || this.modal.miniProgram.page == undefined) {
            this.$message({message: '请添加小程序页面路径', showClose: true, type: 'error'})
            return;
          }
        }
        if (this.modal.type == 3) {
          if (this.imageSrc === '' || this.imageSrc == undefined) {
            this.$message({message: '请添加图片', showClose: true, type: 'error'})
            return;
          }
          this.modal.link.fileKey = this.fileKey;
          this.modal.link.picUrl = this.imageSrc;
          if (this.modal.link.title == '' || this.modal.link.title == undefined) {
            this.$message({message: '请输入网页标题', showClose: true, type: 'error'})
            return;
          }
          if (this.modal.link.url == '' || this.modal.link.url == undefined) {
            this.$message({message: '请输入网页链接', showClose: true, type: 'error'})
            return;
          }

        }

        if (this.modal.type == 2) {
          if (this.imageSrc === '' || this.imageSrc == undefined) {
            this.$message({message: '请添加图片', showClose: true, type: 'error'})
            return;
          }
          this.modal.image.fileKey = this.fileKey;
          this.modal.image.picUrl = this.imageSrc;
        }
        if (this.modal.id == null || this.modal.id == undefined) {
          this.modal.createdBy = store.getters.user.loginName;
          if (this.welcomeType == 0) {
            addWelcome(this.modal).then(response => {
              this.$message({message: '添加成功', showClose: true, type: 'success'})
              this.$emit("LoadDates");
            })

          } else {
            addDefaultWelcome(this.modal).then(response => {
              this.$message({message: '默认语添加成功', showClose: true, type: 'success'})
              this.$emit("LoadDateDefault");
            })
          }
          this.welcomeDilog = false;
        } else {
          this.modal.updatedBy = store.getters.user.loginName;
          updateWelcome(this.modal).then(response => {
            this.$message({message: '编辑成功', showClose: true, type: 'success'})
            this.welcomeDilog = false;
            this.$emit("LoadDates");
          })
        }

      },
    },


  }
</script>
<style lang="scss">
  .image-slot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<style lang="scss" scoped>
  .bg_image {
    width: 180px;
    height: 180px;
  }

  .bg_image:hover {
    cursor: pointer;
  }

  .image {
    border: 1px dashed #d3d4d6;
    height: 180px;
    width: 180px;
    border-radius: 10px;
  }
</style>
