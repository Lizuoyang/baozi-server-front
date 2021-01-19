<-- 客户列表-->
<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="客户名:">
            <el-input v-model="queryForm.name" clearable placeholder="请输入客户名" @clear="loadDate"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              @clear="loadDate"
              v-model="timeLimit"
              style="width:280px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择标签">
            <treeselect
              size="small"
              style="width: 300px"
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

          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="resetBtn()">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="btnClick()">查询</el-button>
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
          highlight-current-row>
          <el-table-column align="center" type="index" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="客户"
            width="140">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="性别"
            width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.gender==0">未知</span>
              <span v-if="scope.row.gender==1">男性</span>
              <span v-if="scope.row.gender==2">女性</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类型"
            width="140">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">微信用户</span>
              <span v-if="scope.row.type==2">企业微信用户</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="企业信息">
            <template slot-scope="scope">
              {{ scope.row.corpFullName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标签">
            <template slot-scope="scope">
              <el-tag style="margin:5px;" v-for="item in scope.row.tags" :key="item.jobId" effect="dark" size="mini"
                      color="#13C2C2">
                {{ item }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-warning-outline" @click="handleEditBtnClick(scope.row)">详细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="modal.total>0" :total="modal.total" :page.sync="queryForm.pageNum"
                    :limit.sync="queryForm.pageSize" @pagination="loadDate()"/>
      </el-footer>
    </el-container>
    <Info ref='info'  :id='this.id'/>
  </el-card>


</template>

<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import store from '@/store'
  import { getList,getTags } from '@/api/customer'
  import Pagination from '@/components/Pagination'
  import Info from './components/info.vue'
  import {tagsToTree} from "@/utils/treeSelect";
  import {getExternalContactList} from '@/api/external'
  export default {
    components: {
      Pagination,
      Treeselect,
      Info,
    },
    data() {
      return {
        listLoading: false,
        timeLimit: [],
        queryForm: {
          name: '',
          corpId: '',
          pageSize: 10,
          pageNum: 1,
          tagNames:Array,
        },
        list: [],
        modal: {
          total: 0
        },
        Tags:[],
        visible:false,
        showInfo:false,
        id:'',
        tagTreeValue:[],
        tagTreeOptions:[],
      }
    },
    created() {
      this.queryForm.corpId = store.getters.currentCorp.id
      this.loadDate();
      if(this.tagTreeOptions.length==0){
          this.GetTags();
      }

    },
    methods: {
      async GetTags(){
         let tagsRes = await getExternalContactList(store.getters.currentCorp.id);
        this.tagTreeOptions = _.map(tagsRes, tagsToTree)
      },
      handleTagTreeSelectInput(row) {
        this.tagTreeValue = row;
        console.log("------------")
      },
      btnClick(){

          this.loadDate();
      },
      loadDate() {
        if(this.timeLimit!=null &&this.timeLimit.length==2){
          this.queryForm.startTime=this.timeLimit[0];
          this.queryForm.endTime=this.timeLimit[1];
        }else{
            this.queryForm.startTime='';
            this.queryForm.endTime='';
        }
        this.Tags=[];
        for(var i=0;i<this.tagTreeValue.length;i++){
            var a=this.tagTreeValue[i].label;
            console.log(a);
            this.Tags.push(this.tagTreeValue[i].label);
        }
        this.queryForm.tagNames=this.Tags;
        this.listLoading=true;
        getList(this.queryForm).then(response => {
          console.log(response)
          this.list = response.data.list
          this.modal = response.data
           this.listLoading=false;
        })
      },
      resetBtn() {
        this.queryForm.title = ''
        this.queryForm.pageNum = 1
        this.queryForm.type = ''
         this.queryForm.tagNames=Array;
         this.loadDate();

      },
      handleEditBtnClick(data) {
           this.id=data.id;
           console.log("==&&&&&&&&&&&7="+this.id);
          this.$refs.info.showInfoDialog(this.id);
      },


      //关闭弹窗
      closeDialog(){
        this.visible=false;
      },

    }
  }

</script>


<style lang="scss" scoped>
  .el-tag--dark {
    border-color: #13C2C2;
  }
  .bg_tag{
    height:32px;
    width:280px;
      border-style:solid;
    border-color: #DCDFE6;
    border-width:1px;
    line-height:32px;
    border-radius:5px;
    padding-left:5px;
    padding-right:5px;
  }
  .tag_text{
    color:#909399;
    font-size:13px;
    margin-left:5px;
  }
</style>
