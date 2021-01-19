<-- 客户标签-->
<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="标签组织名称:">
            <el-input v-model="queryForm.groupName" clearable placeholder="请输入标签组织名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="resetBtn()">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="btnClick()">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="addBtnClick()" v-has="$g.add" >新增</el-button>
            <el-button  icon="el-icon-delete" type="danger"  @click="delAllTags()" v-has="$g.remove" >批量删除 </el-button>
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
          <el-table-column align="center" type="index" label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            label="标签名称"
            width="250">
            <template slot-scope="scope">
              {{ scope.row.groupName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="标签">
            <template slot-scope="scope">
              <el-tag style="margin:5px;" v-for="item in scope.row.ecTagList" :key="item.tagId" effect="dark" size="mini"
                      color="#13C2C2">
                {{ item.tagName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">

              <el-button  type="text" icon="el-icon-edit" size="small" v-has="$g.edit"
                          @click="handleEditBtnClick(scope.row)">编辑
              </el-button>
              <el-button  icon="el-icon-delete" type="text" size="small" v-has="$g.remove"
                          @click="DeleteBtnClick(scope.row.groupId)">删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="modal.total>0" :total="modal.total" :page.sync="queryForm.pageNum"
                    :limit.sync="queryForm.pageSize" @pagination="loadDate()"/>
      </el-footer>
    </el-container>
    <tagInfo ref='taginfo' @submit='submit'/>
  </el-card>
</template>
<script>
  import store from '@/store'
  import { getList, editTags, addTags, deleteTags } from '@/api/ectag'
  import Pagination from '@/components/Pagination'
  import tagInfo from './components/tagInfo.vue'

  export default {
    components: {
      Pagination,
      tagInfo
    },
    data() {
      return {
        listLoading: false,
        queryForm: {
          groupName: '',
          pageNum: 1,
          pageSize: 20
        },
        modal: {
          total: 0
        },
        list: [],
        ids:[],
      }
    },
    mounted() {

    },
    created() {
      this.queryForm.corpId = store.getters.currentCorp.id
      this.LoadDate()
    },
    methods: {
      LoadDate() {
        this.listLoading = true
        getList(this.queryForm).then(response => {
          console.log(response)
          this.list = response.list
          this.modal = response
          this.listLoading = false
        })
      },
      btnClick() {
        this.queryForm.pageNum = 1
        this.LoadDate()
      },
      resetBtn() {
        this.queryForm.pageNum = 1
        this.queryForm.groupName = ''
        this.LoadDate()
      },
      addBtnClick() {
        this.$refs.taginfo.showInfobtn(null)
      },
      handleEditBtnClick(data) {
        this.$refs.taginfo.showInfobtn(data)
      },
      handleSelectionChange(val) {
        this.ids=val.map(x => x.groupId)
      },
      delAllTags(){
        if(this.ids.length>0){
          this.deleteBtn(this.ids);
        }else{
          this.$message({ message: '请选择你要删除的内容,', showClose: true, type: 'error' })
        }
      },
      DeleteBtnClick(data){
        let ids = []
        ids.push(data);
        this.deleteBtn(ids);
      },
        deleteBtn(ids) {
        this.$confirm('删除后，已添加到客户信息的标签也一起删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTags(ids, store.getters.currentCorp.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.queryForm.pageNum = 1
            this.LoadDate()
          })
        })
      },
      submit(form) {
        var pram = []
        var parmTag = []
        for (let i = 0; i < form.dynamicTags.length; i++) {
          var obj = new Object()//创建对象
          var obj1 = new Object()
          obj.tagName = form.dynamicTags[i]
          obj.tagId = form.tagIds[i]
          obj1.name = form.dynamicTags[i]
          pram.push(obj)
          parmTag.push(obj1)
        }
        var pagams = {
          groupName: form.tagGroupName,
          corpId: store.getters.currentCorp.id,
          id: form.id
        }
        if (form.id == '' || form.id == undefined) {
          pagams.tag = parmTag
          addTags(pagams).then(response => {
            console.log(response)
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.queryForm.pageNum = 1
            this.LoadDate()
            this.$refs.taginfo.close()
          })
        } else {
          pagams.ecTagList = pram
          console.log('参数' + pagams)
          editTags(pagams).then(response => {
            console.log(response)
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.queryForm.pageNum = 1
            this.LoadDate()
            this.$refs.taginfo.close()
          })
        }
      }
    }
  }


</script>
<style lang="scss" scoped>
  .el-tag--dark {
    border-color: #13C2C2;
  }

</style>
