<template>
  <div>
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="组织架构:">
            <treeselect
              size="small"
              :defaultExpandLevel="1"
              style="width: 300px"
              placeholder="请选择群聊成员"
              noOptionsText="暂无数据"
              noChildrenText="暂无数据"
              @input="handleTreeSelectInput"
              @select="handleTreeSelectSelect"
              :options="treeOptions"
              :disable-branch-nodes="false"
              v-model="queryForm.organization"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleUserAddBtnClick" v-has="$g.add">
              添加成员
            </el-button>
            <el-button type="primary" icon="el-icon-upload2" @click="handleOpen" v-has="$g.import">批量导入</el-button>
            <el-button icon="el-icon-delete" type="danger" @click="handleUserDelBtnClick" v-has="$g.remove">删除
            </el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          @selection-change="handleDepartUserTabSelect"
          :data="address.list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip width="150">
            <template slot-scope="scope">
              <el-tag type="success">
                <i class="el-icon-user"/>
                <span style="padding-left: 5px">{{ scope.row.name }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="jobName" label="职务" align="center" width="150"></el-table-column>
          <el-table-column prop="departmentName" label="部门" align="center" width="150"></el-table-column>
          <el-table-column prop="cellphone" label="手机" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="jobId" label="账号" align="center"></el-table-column>
          <el-table-column prop="genderText" label="性别" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="userType" label="用户类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userType==1">内部帐号</span>
              <span v-if="scope.row.userType==2">内部虚拟帐号</span>
              <span v-if="scope.row.userType==3">外部帐号</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination :total="address.total" :page.sync="address.listQuery.page" :limit.sync="address.listQuery.limit"
                    @pagination="initDepartusers"/>
      </el-footer>
    </el-container>
    <excel-import
      :fields="eleImport.fields"
      :filepath="eleImport.filepath"
      :append="eleImport.append"
      :formatter="eleImport.formatter"
      :request-fn="requestFn"
      :close-fn="closeFn"
      :rules="eleImport.rules"
      :tips="eleImport.tips"
      :title="eleImport.title"
      :visible="eleImport.visible"
    ></excel-import>

    <update-dialog :dialog="dialog" ref="updDialog"></update-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import {mapGetters} from 'vuex'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {getDepartTreeList} from '@/api/department'
  import {getDepartUserList, getNewJobId, delDepartUser, importDepartUser} from '@/api/departuser'
  import {departmentTreeMapSquare} from '@/utils/treeSelect'
  import UpdateDialog from './UpdateDialog'
  import ExcelImport from '@/components/ExcelImport'

  export default {
    name: "OrgUser",
    data() {
      return {
        eleImport: {
          rules: {
            name: {type: 'string', required: true, message: '姓名必填'},
            genderText: {type: 'string', required: true, message: '性别必填'},
            cellphone: [
              {type: 'number', message: '手机号必须为数字'},
              {required: true, message: '手机号必须填写'}
            ],
            jobName: {type: 'string', required: true, message: '职务必填'},
            userType: {type: 'string', required: true, message: '账户类型必填'},
          },
          formatter: {
            // 可以是对象, 在发送请求时, '深圳' 将被替换成 1, '广州' 被替换成 2
            userType: (val) => {
              return _.eq(val, '虚拟账户') ? 2 : 3
            },
          },
          fields: {
            name: '姓名*',
            genderText: '性别*',
            cellphone: '手机号*',
            jobName: '职务*',
            email: '邮箱',
            userType: '账户类型*'
          },
          append: {},
          visible: false,
          // 弹窗的标题
          title: '批量导入',
          // 提示信息
          tips: ['姓名必填', '性别必填', '手机号必填', '职务必填', '账户类型必填'],
          filepath: 'https://omni-test.oss-cn-shenzhen.aliyuncs.com/work-weixin/work_wx_user_template.xlsx',
          tableData: ""
        },
        dialog: {
          visible: false,
          title: "添加成员",
          orgUser: {
            genderText: '男',
            state: 0
          }
        },
        selectDepartUsers: [],
        address: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        listLoading: false,
        queryForm: {
          organization: 1
        },
        treeOptions: null,
      }
    },
    components: {
      Treeselect,
      Pagination,
      UpdateDialog,
      ExcelImport
    },
    computed: {
      ...mapGetters([
        'currentCorp',
        'user'
      ])
    },
    watch: {
      'dialog.visible'(val) {
        if (!val) {
          this.initDepartusers();
        }

      }
    },
    created() {
      this.initData()
    },
    methods: {
      async closeFn() {
        this.eleImport.visible = false
      },
      async requestFn(data) {
        console.log("requestFn: ", data)
        this.eleImport.tableData = JSON.stringify(data)
        await importDepartUser(this.eleImport.tableData, this.currentCorp.id)
        return Promise.resolve()
      },
      handleOpen() {
        console.log(this.queryForm.organization)
        if (_.isNull(this.queryForm.organization)) {
          this.$notify.info("请选择组织架构")
          return
        }
        this.eleImport.visible = true
      },
      handleDepartUserTabSelect(data) {
        this.selectDepartUsers = data
      },
      handleUserDelBtnClick() {
        if (_.isEmpty(this.selectDepartUsers)) {
          this.$notify.info("请选择要删除的成员")
          return
        }
        delDepartUser(this.selectDepartUsers.map(x => x.id), this.currentCorp.id).then(() => {
          this.initDepartusers()
          this.$notify({
            type: 'success',
            title: this.dialog.title,
            position: 'top-right',
            message: '删除成功',
            showClose: false,
            offset: 50,
            duration: 1000
          })
        })
      },
      async handleUserAddBtnClick() {
        if (_.isNull(this.queryForm.organization)) {
          this.$notify.info("请选择组织架构")
          return
        }
        this.dialog.orgUser = {
          genderText: '男',
          state: 0
        }
        if (this.$refs.updDialog.$refs.orgUserRuleForm) {
          this.$refs.updDialog.$refs.orgUserRuleForm.clearValidate()
        }
        let jobId = await getNewJobId({corpId: this.currentCorp.id})
        this.dialog.visible = true
        this.dialog.orgUser.jobId = jobId
        this.dialog.orgUser.corpId = this.currentCorp.id
        this.dialog.orgUser.createdBy = this.user.loginName
        this.dialog.orgUser.departmentId = _.cloneDeep(this.queryForm.organization)
      },
      handleQueryFormSubmit(isreset) {
        if (isreset) {
          this.queryForm = {
            organization: 1
          }
        }
        this.initDepartusers()
      },
      async initData() {
        await this.initDepartments()
        await this.initDepartusers()
      },
      async initDepartusers() {
        this.listLoading = true
        let {list, total} = await getDepartUserList({
          corpId: this.currentCorp.id,
          departmentId: this.queryForm.organization,
          page: this.address.listQuery.page,
          limit: this.address.listQuery.limit
        })
        this.address.list = list
        this.address.total = total
        this.listLoading = false;
      },
      flatten(data) {
        return data.reduce((arr, {id, parentId, label, children = []}) =>
          arr.concat([{id, parentId, label}], this.flatten(children)), [])
      },
      initDepartments: async function () {
        let data = await getDepartTreeList({
          corpId: this.currentCorp.id
        })
        this.treeOptions = _.map(data, departmentTreeMapSquare)
        // 组织架构扁平后分组
        /*let exportData = this.flatten(data)
        console.log("exportData: ", exportData)
        let exportData2 = _.forEach(exportData, x => {
          let parent = _.find(exportData, {id: x.parentId})
          if (parent) {
            x.parentName = parent.label;
          }
        })
        let groupBy = _.groupBy(exportData2, 'parentName')
        let result = []
        _.forEach(groupBy, (key, value) => {
          let label = value
          _.forEach(key, x => {
            label = label + " ---> " + x.label
          })
          result.push(label)
        })
        console.log("result: ", JSON.stringify(result))*/
      },
      handleTreeSelectInput(value, instanceId) {
        this.initDepartusers();
      },
      handleTreeSelectSelect(node, instanceId) {
        console.log("handleTreeSelectSelect node:", node)
        let departmentName = node.label
        let departmentId = node.id
        let corpId = this.currentCorp.id
        this.eleImport.append.departmentName = departmentName
        this.eleImport.append.departmentId = departmentId
        this.eleImport.append.corpId = corpId
        this.eleImport.append.createdBy = this.user.loginName
        this.initDepartusers();
      },
    }
  }
</script>

<style scoped>

</style>
