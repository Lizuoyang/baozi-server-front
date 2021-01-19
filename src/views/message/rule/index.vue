<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="规则名称:">
            <el-input v-model="queryForm.serviceName" clearable placeholder="规则名称" @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select v-model="queryForm.type" placeholder="规则类型" clearable @clear="initData()">
              <el-option v-for="type in typeList" :key="type.code" :label="type.name"
                         :value="type.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人:">
            <el-input v-model="queryForm.serviceName" clearable placeholder="操作人名称" @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)" v-waves>重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)" v-waves>查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleRuleEditBtnClick(null)" v-waves v-has="$g.add">新增</el-button>
            <el-button type="danger" icon="el-icon-delete-solid" @click="handleRuleBatchDeleteBtnClick()" v-waves v-has="$g.remove">批量删除</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="rule.list"
          element-loading-text="加载中"
          @selection-change="handleSelectionChange"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label="规则名称" align="center" prop="serviceName"></el-table-column>
          <el-table-column label="TOKEN" align="center" prop="token" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型" align="center">
            <template slot-scope="scope">
              {{scope.row.type == 1 ? '群聊' : '多人'}}
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" prop="createdBy"></el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="修改人" align="center" prop="updatedBy"></el-table-column>
          <el-table-column label="修改时间" align="center" prop="updatedTime" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleRuleEditBtnClick(scope.row)" v-has="$g.edit"
              >编辑
              </el-button>
              <el-button v-if="!scope.row.status" icon="el-icon-delete" type="text" size="small"
                         @click="handleRuleDeleteBtnClick(scope.row.id)" :disabled="scope.row.isDelete" v-has="$g.remove">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="rule.total>0" :total="rule.total" :page.sync="rule.listQuery.page"
                    :limit.sync="rule.listQuery.limit" @pagination="initData"/>
      </el-footer>
    </el-container>

    <update-dialog :dialog="dialog" ref="updDialog"></update-dialog>
  </el-card>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {getRuleListPage,delRuleBatch, getRuleObj} from '@/api/message'
  import UpdateDialog from './components/UpdateDialog'
  import {mapGetters} from 'vuex'
  import {memberToTree} from "@/utils/treeSelect";
  export default {
    name: "RuleList",
    components: {
      Pagination,
      UpdateDialog
    },
    data(){
      return {
        dialog: {
          visible: false,
          title: '',
          rule: {}
        },
        listLoading: true,
        queryForm: {
          serviceName: "",
          type: "",
          createdBy: ""
        },
        rule: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        typeList: [
          {name: "群聊", code: "1"},
          {name: "多人", code: "2"}
        ],
        multipleSelection: []
      }
    },
    created() {
      this.initData()
    },
    watch: {
      'dialog.visible'(val) {
        if (!val) {
          this.initData()
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentCorp'
      ])
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleRuleDeleteBtnClick(id){
        this.$confirm('确定要删除此规则吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await delRuleBatch([id]);
          this.$message({
            type:  'success',
            message: '删除成功!'
          });
          await this.initData()
        })
      },
      async handleRuleBatchDeleteBtnClick(){
        if (_.isNull(this.multipleSelection) || _.isEmpty(this.multipleSelection)) {
          this.$notify.info("请先选择要删除的数据")
          return
        }
        this.$confirm('确定要批量删除规则吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await delRuleBatch(this.multipleSelection.map(x => x.id));
          this.$message({
            type:  'success',
            message: '删除成功!'
          });
          await this.initData()
        })

      },
      handleQueryFormSubmit(isreset){
        if (isreset) {
          this.queryForm = {}
        }
        this.initData()
      },
      async handleRuleEditBtnClick(data){
        if (this.$refs.updDialog.$refs.ruleForm) {
          this.$refs.updDialog.$refs.ruleForm.clearValidate()
        }
        this.dialog.rule = {
          type: 1
        }
        this.$refs.updDialog.memberTreeValue = []
        let selectedRule = _.cloneDeep(data)
        if (_.isEmpty(selectedRule)) {
          this.dialog.title = '新增规则';
        } else {
          this.dialog.title = '编辑规则';
          let queryRule = await  getRuleObj(selectedRule.id)
          this.dialog.rule = _.cloneDeep(queryRule)
          this.$refs.updDialog.selectedUserList = this.dialog.rule.userIdList
          this.$refs.updDialog.memberTreeValue = _.map(this.dialog.rule.userIdList, memberToTree)
          this.dialog.rule.userIdList = this.dialog.rule.userIdList.map(x => x.jobId)
        }
        this.dialog.visible = true
      },
      async initData() {
        this.queryForm.page = this.rule.listQuery.page
        this.queryForm.limit = this.rule.listQuery.limit
        this.listLoading = true
        const {data} = await getRuleListPage(this.queryForm)
        this.rule.list = data.list;
        this.rule.total = data.total
        this.listLoading = false
      }
    }
  }
</script>

<style scoped>

</style>
