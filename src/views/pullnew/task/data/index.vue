<template>
  <el-card class="box-card">
    <el-container>
      <collapse-transition>
        <el-header class="dashboard-head" slot="content">
          <el-form :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="发起人昵称:">
              <el-input v-model="queryForm.name" clearable placeholder="发起人昵称" @clear="initData"></el-input>
            </el-form-item>

            <el-form-item label="被邀请人昵称:">
              <el-input v-model="queryForm.inviteesName" clearable placeholder="被邀请人昵称" @clear="initData"></el-input>
            </el-form-item>

            <el-form-item label="活动名称:">
              <el-input v-model="queryForm.actName" clearable placeholder="活动名称" @clear="initData"></el-input>
            </el-form-item>

            <el-form-item label="活动ID:">
              <el-input v-model="queryForm.actId" clearable placeholder="活动ID" @clear="initData"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
              <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
              <excel-export :file-name="fileName" :head-names="headNames" :column-names="columnNames"
                            :export-data="actData.list" v-has="$g.export"></excel-export>
            </el-form-item>
          </el-form>
        </el-header>
      </collapse-transition>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="actData.list"
          row-key="id"
          element-loading-text="加载中"
          border
          lazy
          fit
          ref="actDataTable"
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="actId" label="活动ID" align="center"></el-table-column>
          <el-table-column prop="actName" label="活动名称" align="center"></el-table-column>
          <el-table-column prop="name" label="发起人昵称" align="center"></el-table-column>
          <el-table-column prop="inviteesName" label="被邀请人昵称" align="center"></el-table-column>
          <el-table-column prop="createdTime" label="注册时间" align="center"></el-table-column>
          <el-table-column prop="awardTime" label="领取时间" align="center"></el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="actData.total>0" :total="actData.total" :page.sync="actData.listQuery.page"
                    :limit.sync="actData.listQuery.limit" @pagination="initData"/>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import CollapseTransition from '@/components/CollapseTransition'
  import ExcelExport from '@/components/ExcelExport'
  import {getActivityDataList} from '@/api/task-activity'
  import {mapGetters} from 'vuex'

  export default {
    name: "Data",
    data() {
      return {
        actData: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        queryForm: {
          name: "",
          inviteesName: "",
          actName: "",
          actId: "",
        },
        listLoading: false,
        fileName: "任务宝活动数据",
        headNames: ['活动ID', '活动名称', '发起人昵称', '被邀请人昵称', '注册时间', '领取时间'],
        columnNames: ['actId', 'actName', 'name', 'inviteesName', 'createdTime', 'awardTime']
      }
    },
    components: {
      Pagination,
      ExcelExport,
      CollapseTransition
    },
    computed: {
      ...mapGetters([
        'currentCorp'
      ])
    },
    created() {
      this.initData()
    },
    methods: {
      async initData() {
        this.listLoading = true
        this.queryForm.page = this.actData.listQuery.page
        this.queryForm.limit = this.actData.listQuery.limit
        this.queryForm.corpId = this.currentCorp.id
        let res = await getActivityDataList(this.queryForm)
        this.actData.list = res.list
        this.actData.total = res.total
        this.listLoading = false
      },
      handleQueryFormSubmit(isrest) {
        if (isrest) {
          this.queryForm = {
            name: "",
            inviteesName: "",
            actName: "",
            actId: "",
          }
        }
        this.initData();
      }
    }
  }
</script>

<style scoped>

</style>
