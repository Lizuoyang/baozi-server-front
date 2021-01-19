<template>
  <el-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="40%" top="5vh" lazy>
    <el-container style="height: 500px;">
      <el-main>
        <el-form :model="dialog.act" :rules="actRules" ref="actRuleForm" label-width="100px"
                 class="demo-ruleForm" :inline="false">
          <el-form-item label="企业名称:" prop="corpName">
            <el-input v-model="dialog.act.corpName" :disabled="true" placeholder="请输入企业名称" style="width: 84%"></el-input>
          </el-form-item>

          <el-form-item label="活动名称:" prop="actName">
            <el-input v-model="dialog.act.actName" placeholder="请输入活动名称" style="width: 84%"></el-input>
          </el-form-item>

          <el-form-item label="活动时间:" prop="actTimes">
            <el-date-picker v-model="dialog.act.actTimes" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" @change="handleActDateTimerRangeChange"
                            style="width: 400px;"></el-date-picker>
          </el-form-item>

          <el-form-item label="选择种子:" prop="jobIds">
            <department-tree-select :value="memberTreeValue" @input="handleTreeSelectInput"
                                    style="width: 400px"></department-tree-select>
          </el-form-item>

          <el-form-item label="选择标签:" prop="tagIds">
            <treeselect
              style="width: 400px"
              size="small"
              placeholder="请选择"
              noOptionsText="暂无数据"
              noChildrenText="暂无数据"
              :openOnFocus="true"
              :multiple="true"
              :defaultExpandLevel="0"
              @input="handleTagTreeSelectInput"
              :options="tagTreeOptions"
              :disable-branch-nodes="true"
              :value="tagTreeValue"
              valueFormat="node"
              search-nested
            />
          </el-form-item>

          <el-form-item label="裂变话术:" prop="splitWord">
            <el-input
              autosize
              type="textarea"
              style="width:84%"
              v-model="dialog.act.splitWord"
              placeholder="请输入裂变话术">
            </el-input>
          </el-form-item>

          <el-form-item label="客户数量:" prop="splitTarget">
            <el-input-number v-model="dialog.act.splitTarget" :min="1" step-strictly controls-position="right"
                             size="small"></el-input-number>
          </el-form-item>

          <el-form-item label="裂变海报:" prop="porterLink">
            <file-upload @success="handlePorterLinkUploadSuccess" :defaultImage="{linkUrl: dialog.act.porterLink}" :file-type="['jpg','png','jpeg']"></file-upload>
          </el-form-item>

          <el-form-item label="欢迎语:" prop="welcomeDTO.content">
            <el-autocomplete
              autosize
              type="textarea"
              :fetch-suggestions="querySearchAsync"
              style="width:84%"
              v-model="dialog.act.welcomeDTO.content"
              placeholder="请输入欢迎语">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="素材类型:" prop="welcomeDTO.type">
            <el-radio-group v-model="dialog.act.welcomeDTO.type">
              <el-radio-button label="0">文本</el-radio-button>
              <el-radio-button label="2">图片</el-radio-button>
              <el-radio-button label="3">网页</el-radio-button>
              <el-radio-button label="1">小程序</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="素材图片:" prop="welcomeDTO.image.picUrl" v-if="dialog.act.welcomeDTO.type != 0">
            <file-upload @success="handlePicUrlUploadSuccess" :defaultImage="{linkUrl: dialog.act.welcomeDTO.image.picUrl}"  :file-type="['jpg','png','jpeg']"></file-upload>
          </el-form-item>

          <div v-if="dialog.act.welcomeDTO.type == 3">
            <el-form-item label="标题:" prop="welcomeDTO.link.title">
              <el-input v-model="dialog.act.welcomeDTO.link.title" placeholder="请输入网页标题" style="width: 84%"></el-input>
            </el-form-item>

            <el-form-item label="网页链接:" prop="welcomeDTO.link.url">
              <el-input v-model="dialog.act.welcomeDTO.link.url" placeholder="请输入网页链接" style="width: 84%"></el-input>
            </el-form-item>

            <el-form-item label="网页描述:" prop="welcomeDTO.link.desc">
              <el-input v-model="dialog.act.welcomeDTO.link.desc" placeholder="请输入网页描述" style="width: 84%"></el-input>
            </el-form-item>
          </div>

          <div v-if="dialog.act.welcomeDTO.type == 1">
            <el-form-item label="标题:" prop="welcomeDTO.miniProgram.title">
              <el-input v-model="dialog.act.welcomeDTO.miniProgram.title" placeholder="请输入小程序标题"
                        style="width: 84%"></el-input>
            </el-form-item>

            <el-form-item label="APPID:" prop="welcomeDTO.miniProgram.appid">
              <el-input v-model="dialog.act.welcomeDTO.miniProgram.appid" placeholder="请输入小程序appid"
                        style="width: 84%"></el-input>
            </el-form-item>

            <el-form-item label="URL:" prop="welcomeDTO.miniProgram.page">
              <el-input v-model="dialog.act.welcomeDTO.miniProgram.page" placeholder="请输入小程序路径"
                        style="width: 84%"></el-input>
            </el-form-item>
          </div>

        </el-form>
      </el-main>
    </el-container>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submitActForm()" icon="el-icon-circle-check">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import DepartmentTreeSelect from '@/components/DepartmentTreeSelect'
  import FileUpload from '@/components/FileUpload'
  import {getTextList} from '@/api/material'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {updateActivity, addActivity} from '@/api/task-activity'
  import {mapGetters} from 'vuex'

  export default {
    name: "UpdatedDialog",
    data() {
      let validateWelcomePic = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 2 && _.isEmpty(this.dialog.act.welcomeDTO.image.picUrl)) {
          callback(new Error('请上传素材图片!'));
        } else {
          callback();
        }
      };
      let validateWelcomeTitle = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 3 && _.isEmpty(value)) {
          callback(new Error('请输入网页标题!'));
        } else {
          callback();
        }
      };
      let validateWelcomeDesc = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 3 && _.isEmpty(value)) {
          callback(new Error('请输入网页描述!'));
        } else {
          callback();
        }
      };
      let validateWelcomeUrl = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 3 && _.isEmpty(value)) {
          callback(new Error('请输入网页链接!'));
        } else {
          callback();
        }
      };
      let validateMiniProgramTitle = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 1 && _.isEmpty(value)) {
          callback(new Error('请输入小程序标题!'));
        } else {
          callback();
        }
      };
      let validateMiniProgramPage = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 1 && _.isEmpty(value)) {
          callback(new Error('请输入小程序Url!'));
        } else {
          callback();
        }
      };
      let validateMiniProgramAppid = (rule, value, callback) => {
        if (this.dialog.act.welcomeDTO.type == 1 && _.isEmpty(value)) {
          callback(new Error('请输入小程序appid!'));
        } else {
          callback();
        }
      };
      return {
        memberTreeValue: null,
        tagTreeOptions: [],
        tagTreeValue: null,
        actRules: {
          actName: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
          ],
          'welcomeDTO.content': [
            {required: true, message: '请输入欢迎语', trigger: 'blur'},
          ],
          splitWord: [
            {required: true, message: '请输入裂变话术', trigger: 'blur'},
          ],
          porterLink: [
            {required: true, message: '请上传裂变海报', trigger: 'blur'},
          ],
          'welcomeDTO.image.picUrl': [
            {validator: validateWelcomePic, trigger: ['blur']},
          ],
          'welcomeDTO.link.title': [
            {validator: validateWelcomeTitle, trigger: ['blur']},
          ],
          'welcomeDTO.link.desc': [
            {validator: validateWelcomeDesc, trigger: ['blur']},
          ],
          'welcomeDTO.link.url': [
            {validator: validateWelcomeUrl, trigger: ['blur']},
          ],
          'welcomeDTO.miniProgram.title': [
            {validator: validateMiniProgramTitle, trigger: ['blur']},
          ],
          'welcomeDTO.miniProgram.appid': [
            {validator: validateMiniProgramAppid, trigger: ['blur']},
          ],
          'welcomeDTO.miniProgram.page': [
            {validator: validateMiniProgramPage, trigger: ['blur']},
          ],
          actTimes: [
            {required: true, message: '请选择活动时间', trigger: ['blur']},
          ],
          tagIds: [
            {required: true, message: '请选择标签', trigger: ['blur']},
          ],
        },
        restaurants: []
      }
    },
    components: {
      DepartmentTreeSelect,
      FileUpload,
      Treeselect
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      handlePorterLinkUploadSuccess(row) {

        this.dialog.act.porterLink = row.accessUrl
      },
      handlePicUrlUploadSuccess(row) {
        if (this.dialog.act.welcomeDTO.type == 1) {
          this.dialog.act.welcomeDTO.miniProgram.picUrl = row.accessUrl
          this.dialog.act.welcomeDTO.miniProgram.fileKey = row.fileKey
        }
        if (this.dialog.act.welcomeDTO.type == 2) {
          this.dialog.act.welcomeDTO.image.picUrl = row.accessUrl
          this.dialog.act.welcomeDTO.image.fileKey = row.fileKey
        }
        if (this.dialog.act.welcomeDTO.type == 3) {
          this.dialog.act.welcomeDTO.link.picUrl = row.accessUrl
        }
      },
      handleTagTreeSelectInput(row) {
        this.tagTreeValue = row
        this.dialog.act.tags = row
        this.dialog.act.tagIds = row.map(x => x.tagId)
      },
      async loadAll() {
        const {data} = await getTextList({corpId: this.dialog.act.corpId, page: 1, limit: 99999, type: 'text'});
        return data.list.filter(f => !_.isEmpty(f.content)).map(x => {
          let res = {value: x.content}
          return res
        })
      },
      querySearchAsync(queryString, cb) {
        let restaurants = this.restaurants;
        let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(results);
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleActDateTimerRangeChange(row) {
        console.log(row)
        this.dialog.act.beginTime = row[0]
        this.dialog.act.endTime = row[1]
      },
      submitActForm() {
        this.$refs['actRuleForm'].validate(async valid => {
          if (valid) {
            console.log(this.dialog.act)
            if (this.dialog.type == 'upd') {
              this.dialog.act.updatedBy = this.user.loginName
              // 修改活动
              await updateActivity(this.dialog.act)
            } else {
              // 新增 & 复制 活动
              if (this.dialog.type == 'copy') {
                this.dialog.act.id = null
              }
              await addActivity(this.dialog.act)
            }
            this.dialog.visible = false
            this.$notify({
              type: 'success',
              title: this.dialog.title,
              position: 'top-right',
              message: '操作成功',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          } else {
            return false;
          }
        })
      },
      handleTreeSelectInput(data) {
        console.log("handleTreeSelectInput data: ", data)
        this.dialog.act.userIds = data
        this.dialog.act.jobIds = data.map(x => x.jobId)
      }
    },
    async mounted() {
      this.restaurants = await this.loadAll();
    },
    props: {
      dialog: {
        type: Object,
        default: () => {
        }
      }
    }
  }
</script>

<style scoped>

</style>
