//渠道列表
<template>
  <div style="height:100%">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="渠道名称:">
            <el-input v-model="queryForm.stateName" clearable placeholder="请输入渠道名称" @clear="LoadSatetList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="LoadSatetList()">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="addEditeChannel(null)" v-has="$g.add">
              添加
            </el-button>
            <el-button icon="el-icon-delete" type="danger" size="small" @click="delAllChannel()" v-has="$g.remove">批量删除
            </el-button>
            <excel-export :file-name="fileName" :head-names="headNames" :column-names="columnNames" :export-data="list"
                          v-has="$g.export"></excel-export>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          @selection-change="handleSelectionChange"
          highlight-current-row>
          <el-table-column align="center" type="index" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column align="center" label="渠道编码">
            <template slot-scope="scope">
              {{ scope.row.stateId }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="渠道名称">
            <template slot-scope="scope">
              {{ scope.row.stateName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="拉新数量">
            <template slot-scope="scope">
              {{ scope.row.count }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">业务</span>
              <span v-if="scope.row.type==2">活动</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-edit" @click="addEditeChannel(scope.row)" v-has="$g.edit"
                         type="text">编辑
              </el-button>
              <el-button icon="el-icon-delete" size="small" v-has="$g.remove"
                         @click="btnDelete(scope.row.id)" type="text">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination
          v-show="modal.total > 0"
          :total="modal.total"
          :page.sync="queryForm.pageNum"
          :limit.sync="queryForm.pageSize"
          @pagination="LoadSatetList"
        />
      </el-footer>
    </el-container>
    <Channelinfo ref="channelinfo"
                 :title='title'
                 @LoadSatetList='LoadSatetList'/>
  </div>

</template>

<script>
  import {getStateList, getStateById, delState} from '@/api/develop'
  import {getExternalContactList} from '@/api/external'
  import ExcelExport from '@/components/ExcelExport'
  import Channelinfo from '../components/Channelinfo'
  import Pagination from "@/components/Pagination"
  import {tagsToTree} from "@/utils/treeSelect";
  import store from '@/store'

  export default {
    name: 'channel',
    components: {
      Pagination,
      Channelinfo,
      ExcelExport
    },
    data() {
      return {
        listLoading: false,
        title: '添加',
        list: [],
        ids: [],
        queryForm: {
          stateName: '',
          corpId: store.getters.currentCorp.id,
          pageSize: 10,
          pageNum: 1,
        },
        modal: {
          total: 0
        },
        fileName: "渠道列表",
        headNames: ['渠道编码', '渠道名称', '拉新数量', '类型'],
        columnNames: ['stateId', 'stateName', 'count', 'type']
      }
    },
    created() {
      this.LoadSatetList();
    },
    methods: {
      LoadSatetList() {
        this.listLoading = true;
        getStateList(this.queryForm).then(response => {
          this.list = response.list;
          this.modal = response;
          this.listLoading = false;
        })
      },
      handleSelectionChange(val) {
        this.ids = val.map(x => x.id)
      },
      delAllChannel() {
        if (this.ids.length > 0) {
          this.sureDelete(this.ids);
        } else {
          this.$message({message: '请选择你要删除的内容,', showClose: true, type: 'error'})
        }
      },
      btnDelete(id) {
        var ids = [];
        ids.push(id);
        this.sureDelete(ids);
      },
      sureDelete(ids) {
        this.$confirm('是否删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delState(ids).then(response => {
            this.$message({message: '删除成功', showClose: true, type: 'success'})
            this.LoadSatetList();
          })
        }).catch(() => {

        });

      },
      duplicate(n) {
        return n.ecTagList;
      },
      //添加
      async addEditeChannel(data) {
        let tagsRes = await getExternalContactList(store.getters.currentCorp.id);
        this.$refs.channelinfo.tagTreeOptions = _.map(tagsRes, tagsToTree)
        if (data == null) {
          this.title = '添加'
          this.$refs.channelinfo.showDialog(null)
        } else {
          getStateById(data.id).then(response => {
            console.log(response);
            this.title = '编辑'
            var tagList = [];
            // let allEcTags = tagsRes.map(x => x.ecTagList)
            let allEcTags = _.flatMap(tagsRes, this.duplicate)
            for (var i = 0; i < response.stateEcTags.length; i++) {
              var tags = _.find(allEcTags, {tagId: response.stateEcTags[i].tagId})
              if (tags != undefined) {
                tagList.push(tags);
              }
            }
            this.$refs.channelinfo.tagTreeValue = _.map(tagList, tagsToTree)
            var a = this.$refs.channelinfo.tagTreeValue;
            this.$refs.channelinfo.showDialog(response)
          })
        }
      }
    },
  }
</script>
