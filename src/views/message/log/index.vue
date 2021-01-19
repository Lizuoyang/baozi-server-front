<template>
  <el-card class="box-card">
    <el-container>
      <collapse-transition>
        <el-header class="dashboard-head" slot="content" style="margin-top: 50px">
          <el-form inline :model="queryForm" class="demo-form-inline">
            <el-form-item label="规则名称:">
              <el-select v-model="queryForm.ruleId" clearable filterable @clear="initData()">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in ruleList" :key="item.id" :label="item.serviceName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息类型:">
              <el-select v-model="queryForm.type" clearable filterable @clear="initData()">
                <el-option v-for="item in typeList" :key="item.value" :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发送状态:">
              <el-select v-model="queryForm.isSuccess" clearable filterable @clear="initData()">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址:">
              <el-input v-model="queryForm.ip" clearable placeholder="IP地址" @clear="initData()"></el-input>
            </el-form-item>
            <el-form-item label="开始时间:">
              <el-date-picker
                v-model="queryForm.beginTime"
                type="date"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:">
              <el-date-picker
                v-model="queryForm.endTime"
                type="date"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
            </el-form-item>
          </el-form>
        </el-header>
      </collapse-transition>
      <el-main>
        <el-table
          ref="table"
          row-key="id"
          v-loading="listLoading"
          :data="log.list"
          element-loading-text="加载中"
          border
          fit
          highlight-current-row
          @row-click="handleFlowPageTableClick"
        >
          <el-table-column type="expand" show-overflow-tooltip>
            <template slot-scope="props">
              <el-form label-position="right" class="demo-table-expand">
                <el-form-item label="接收用户:">
                  <el-tag type="success" style="margin-right: 5px" v-for="item in props.row.context.userList" :key="item.jobId">{{item}}</el-tag>
                </el-form-item>
                <el-form-item label="错误消息:" v-if="props.row.isSuccess == 0">
                  <el-tooltip class="item" effect="dark" :content="props.row.context.failReason" placement="top-start">
                    <span>{{ _.truncate(props.row.context.failReason, {'length': 100}) }}</span>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="消息内容:">
                  <el-tooltip class="item" effect="dark" :content="props.row.context.context" placement="top-start">
                    <span>{{ _.truncate(props.row.context.context, {'length': 100}) }}</span>
                  </el-tooltip>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="IP地址" prop="ipAddress" align="center">
            <template slot-scope="scope">
              <el-button type="text">{{scope.row.ipAddress}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="规则名称" prop="serviceName" align="center"></el-table-column>
          <el-table-column label="消息类型" prop="type" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">规则消息</span>
              <span  v-if="scope.row.type == 2">普通消息</span>
              <span  v-if="scope.row.type == 3">打卡消息</span>
            </template>
          </el-table-column>
          <el-table-column label="发送状态" prop="isSuccess" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isSuccess == 1">成功</el-tag>
              <el-tag type="danger"  v-if="scope.row.isSuccess == 0">失败</el-tag>
            </template>
          </el-table-column>
          <!--<el-table-column label="推送内容" align="center">
            <template slot-scope="scope">
              <el-button type="text">查看</el-button>
            </template>
          </el-table-column>-->
          <el-table-column label="内容类型" prop="msgType" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.msgType=='text'">文本消息</span>
              <span v-if="scope.row.msgType=='video'">视频消息</span>
              <span v-if="scope.row.msgType=='image'">图片消息</span>
              <span v-if="scope.row.msgType=='voice'">语音消息</span>
              <span v-if="scope.row.msgType=='file'">文件消息</span>
              <span v-if="scope.row.msgType=='textcard'">文本卡片</span>
              <span v-if="scope.row.msgType=='news'">图文消息</span>
              <span v-if="scope.row.msgType=='file'">文件消息</span>
              <span v-if="scope.row.msgType=='miniprogram_notice'">小程序消息</span>
              <span v-if="scope.row.msgType=='taskcard'">任务卡片消息</span>
              <span v-if="scope.row.msgType=='markdown'">markdown消息</span>
            </template>
          </el-table-column>
          <el-table-column label="发送时间" prop="sendTime" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              <span>{{ scope.row.sendTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="log.total>0" :total="log.total" :page.sync="log.listQuery.page"
                    :limit.sync="log.listQuery.limit" @pagination="initData"/>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
  import {getRuleListPage,getLogListPage, getLogContent} from '@/api/message'
  import Pagination from '@/components/Pagination'
  import CollapseTransition from '@/components/CollapseTransition'
  import {mapGetters} from 'vuex'
  export default {
    name: "LogList",
    data(){
      return {
        listLoading: false,
        log: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        statusList: [
          {name: '全部', value: ""},
          {name: '成功', value: "1"},
          {name: '失败', value: "0"}
        ],
        typeList: [
          {name: '全部', value: ""},
          {name: '规则消息', value: "1"},
          {name: '普通消息', value: "2"},
        ],
        ruleList: [],
        queryForm: {
          ip: "",
          isSuccess: "",
          type: "",
          ruleId: ""
        },
        expandRowKeys: []
      }
    },
    components: {
      Pagination,
      CollapseTransition
    },
    created() {
      this.initRuleList()
      this.initData()
    },
    computed: {
      ...mapGetters([
        'currentCorp'
      ])
    },
    methods: {
      async handleFlowPageTableClick(row) {
        if (_.isEmpty(row.context)) {
          let context = await getLogContent(row.id);
          console.log("handleFlowPageTableClick: ",context)
          row.context = context
        }

        this.$refs['table'].toggleRowExpansion(row, this.expandRowKeys.indexOf(row.id) == -1);
        if (this.expandRowKeys.indexOf(row.id) == -1) {
          this.expandRowKeys.push(row.id);
        } else {
          this.expandRowKeys.splice(0, this.expandRowKeys.length)
        }
      },
      handleQueryFormSubmit(isreset) {
        if (isreset) {
          this.queryForm = {
            ip: "",
            isSuccess: "",
            type: "",
            ruleId: "",
            beginTime: "",
            endTime: ""
          }
        }
        this.initData()
      },
      async initData() {
        this.listLoading = true
        this.queryForm.page = this.log.listQuery.page
        this.queryForm.limit = this.log.listQuery.limit
        this.queryForm.corpId = this.currentCorp.id
        const {data} = await getLogListPage(this.queryForm);
        this.log.list = data.list
        this.log.total = data.total
        this.listLoading = false
      },
      async initRuleList() {
        const {data} = await getRuleListPage({page: 1, limit: 99999});
        this.ruleList = data.list
      }
    }
  }
</script>

<style scoped>

</style>
