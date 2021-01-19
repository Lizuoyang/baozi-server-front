<template>
  <el-card class="box-card">
    <el-container>
      <collapse-transition>
      <el-header class="dashboard-head" slot="content">
        <el-form :inline="true"  :model="queryForm" class="demo-form-inline">
          <el-row :gutter="20">
            <el-form-item label="活动名称:">
              <el-input v-model="queryForm.actName" clearable placeholder="活动名称" @clear="initData"></el-input>
            </el-form-item>

            <el-form-item label="活动ID:">
              <el-input v-model="queryForm.actId" clearable placeholder="活动ID" @clear="initData"></el-input>
            </el-form-item>

            <el-form-item label="活动时间:">
              <el-date-picker
                v-model="queryForm.beginTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="至">
              <el-date-picker
                v-model="queryForm.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-row>

          <el-row :gutter="20">
            <el-form-item label="活动状态:">
              <el-select v-model="queryForm.actState" placeholder="活动状态" filterable clearable @clear="initData">
                <el-option v-for="act in activityStatus" :key="act.val" :label="act.name"
                           :value="act.val"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleActEditBtnClick(null, 'add')" v-has="$g.add">新增</el-button>
              <el-button type="warning" icon="el-icon-switch-button" @click="handleActBatchStopBtnClick" v-has="$g.stop">批量终止</el-button>
              <el-button type="danger" icon="el-icon-delete-solid" @click="handleActBatchDeleteBtnClick" v-has="$g.remove">批量删除</el-button>
            </el-form-item>
          </el-row>
        </el-form>
        </el-header>
      </collapse-transition>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="activity.list"
          row-key="id"
          element-loading-text="加载中"
          @selection-change="handleSelectionChange"
          border
          lazy
          fit
          ref="actListTable"
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
          <el-table-column prop="actName" label="活动名称" align="center" width="150"></el-table-column>
          <el-table-column prop="actId" label="活动ID" align="center" width="150"> </el-table-column>
          <el-table-column prop="actState" label="活动状态"  align="center">
            <template slot-scope="scope">
              <el-tag :type="_.find(activityStatus, {val: scope.row.actState}).type">
                <span>{{_.find(activityStatus, {val: scope.row.actState}).name}}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="beginTime" label="活动起始时间" width="230"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.beginTime}} 至 {{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updatedTime" label="更新时间"  align="center" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="updatedBy" label="操作人"  align="center"> </el-table-column>
          <el-table-column label="操作" align="center" width="280">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="scope.row.actState == 2 || scope.row.actState == 4" icon="el-icon-edit" @click="handleActEditBtnClick(scope.row, 'upd')" v-has="$g.edit">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-copy-document" @click="handleActEditBtnClick(scope.row, 'copy')" v-has="$g.copy">复 制</el-button>
              <el-button type="text" size="small" :disabled="scope.row.actState == 2 || scope.row.actState == 4" icon="el-icon-view" @click="handleActReviewBtnClick(scope.row)" v-has="$g.review">审核</el-button>
              <el-button type="text" size="small" :disabled="scope.row.actState == 2 || scope.row.actState == 4" icon="el-icon-present" @click="handleActRewardBtnClick(scope.row)" v-has="$g.reward">奖品</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="activity.total>0" :total="activity.total" :page.sync="activity.listQuery.page"
                    :limit.sync="activity.listQuery.limit" @pagination="initData"/>
      </el-footer>
    </el-container>
    <update-dialog :dialog="updDialog" ref="updDialog"></update-dialog>
    <reward-dialog :dialog="rewardDialog" ref="rewardDialog"></reward-dialog>
  </el-card>
</template>

<script>
  import {getActivityList, delActivityBatch, stopActivityBatch, reviewActivityBatch, getActivity, getCounponList} from '@/api/task-activity'
  import {getExternalContactList} from '@/api/external'
  import Pagination from '@/components/Pagination'
  import CollapseTransition from '@/components/CollapseTransition'
  import UpdateDialog from './components/UpdateDialog'
  import RewardDialog from './components/RewardDialog'
  import { mapGetters } from 'vuex'
  import {memberToTree,tagsToTree} from "@/utils/treeSelect";
  export default {
    name: "Activity",
    data () {
      return {
        activity: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        listLoading: false,
        queryForm: {
          actState: "",
          actName: "",
          actId: "",
          corpId: "",
          beginTime: "",
          endTime: ""
        },
        activityStatus: [
          {name: "未审核", val: "1", type: "info"},
          {name: "已审核", val: "2", type: "success"},
          {name: "已结束", val: "3", type: "danger"},
          {name: "已终止", val: "4", type: "warning"},
        ],
        multipleSelection: [],
        rewardDialog: {
          reward: {
            assignId: '',
            limitNum: '',
            prizeTotal: '',
            prizeDesc: '',
            prizeLink: ''
          },
          title: "优惠券派发方案设置",
          visible: false,
        },
        updDialog: {
          title: "",
          visible: false,
          act: {
            corpName: "",
            corpId: "",
            welcomeDTO: {
              type: 0,
              image: {},
              link: {},
              miniProgram: {}
            },
            splitTarget: 1
          }
        }
      }
    },
    components: {
      Pagination,
      UpdateDialog,
      RewardDialog,
      CollapseTransition
    },
    computed: {
      ...mapGetters([
        'currentCorp',
        'user'
      ])
    },
    watch: {
      'updDialog.visible'(val) {
        if (!val) {
          this.initData()
        }
      },
      'rewardDialog.visible'(val) {
        if (!val) {
          this.initData()
        }
      }
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        this.queryForm.page = this.activity.listQuery.page
        this.queryForm.limit = this.activity.listQuery.limit
        this.queryForm.corpId = this.currentCorp.id
        const {list, total} = await getActivityList(this.queryForm)
        this.activity.list = list
        this.activity.total = total
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async handleActEditBtnClick(row,type) {
        if (this.$refs.updDialog.$refs.actRuleForm) {
          this.$refs.updDialog.$refs.actRuleForm.clearValidate()
        }

        this.updDialog.act =  {
          welcomeDTO: {
            type: 0,
                    image: {},
            link: {},
            miniProgram: {}
          },
          splitTarget: 1
        }

        this.$refs.updDialog.memberTreeValue = []
        if (row) {
          this.updDialog.title = "修改活动"
          let res = await getActivity(row.id)
          this.updDialog.act = res
          this.updDialog.act.actTimes = [res.beginTime,res.endTime]
          this.$refs.updDialog.memberTreeValue = _.map(this.updDialog.act.userIds, memberToTree)
          console.log(this.updDialog)
        } else {
          this.updDialog.title = "新增活动"
        }
        this.updDialog.type = type
        this.updDialog.act.corpId = this.currentCorp.id;
        this.updDialog.act.corpName = this.currentCorp.corpName;
        this.updDialog.visible = true;
        if (_.isNull(this.updDialog.act.welcomeDTO)) {
          this.updDialog.act.welcomeDTO =  {
            type: 0,
            image: {},
            link: {},
            miniProgram: {}
          }
        }

        if (_.isNull(this.updDialog.act.welcomeDTO.image)) {
          this.updDialog.act.welcomeDTO.image =  {}
        }

        if (_.isNull(this.updDialog.act.welcomeDTO.link)) {
          this.updDialog.act.welcomeDTO.link =  {}
        }

        if (_.isNull(this.updDialog.act.welcomeDTO.miniProgram)) {
          this.updDialog.act.welcomeDTO.miniProgram =  {}
        }

        let tagsRes = await getExternalContactList(this.currentCorp.id)
        this.$refs.updDialog.tagTreeOptions = _.map(tagsRes, tagsToTree)
        this.$refs.updDialog.tagTreeValue = _.map(this.updDialog.act.tags, tagsToTree)
      },
      async handleActRewardBtnClick(row) {
        let res = await getCounponList({status: "4", pageNum: 1, pageSize: 99999})
        this.rewardDialog.coupons = res.content
        if (row) {
          this.rewardDialog.reward.id = row.id
          this.rewardDialog.reward.assignId = row.assignId
          this.rewardDialog.reward.limitNum = row.limitNum
          this.rewardDialog.reward.prizeTotal = row.prizeTotal
          this.rewardDialog.reward.prizeDesc = row.prizeDesc
          this.rewardDialog.reward.prizeLink = row.prizeLink
          console.log(this.rewardDialog.reward)
        }
        this.rewardDialog.visible = true;
      },
      handleActReviewBtnClick(row) {
        this.$confirm('确定审核通过该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reviewActivityBatch(row.id, this.user.loginName).then(async () => {
            this.$message({
              type:  'success',
              message: '操作成功!'
            });
            await this.initData()
          })
        })

      },
      handleQueryFormSubmit(isreset) {
        if (isreset) {
          this.queryForm = {
            actState: "",
            actName: "",
            actId: "",
            corpId: "",
            beginTime: "",
            endTime: ""
          }
        }
        this.initData();
      },
      handleActBatchStopBtnClick() {
        if (_.isNull(this.multipleSelection) || _.isEmpty(this.multipleSelection)) {
          this.$notify.info("请先选择要终止的数据")
          return
        }
        this.$confirm('确定要批量终止活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopActivityBatch(this.multipleSelection.map(x => x.id), this.user.loginName).then(async () => {
            this.$message({
              type:  'success',
              message: '操作成功!'
            });
            await this.initData()
          })
        })

      },
      handleActBatchDeleteBtnClick() {
        if (_.isNull(this.multipleSelection) || _.isEmpty(this.multipleSelection)) {
          this.$notify.info("请先选择要删除的数据")
          return
        }
        this.$confirm('确定要批量删除活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.multipleSelection)
          delActivityBatch(this.multipleSelection.map(x => x.id)).then(async () => {
            this.$notify({
              type:  'success',
              message: '删除成功!'
            });
            await this.initData()
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
