<template>
  <div>
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="标签">
            <el-select v-model="queryForm.tagId" clearable filterable @change="handleTagSelectChange">
              <el-option v-for="item in tagList" :label="item.tagName" :value="item.tagId" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleUserAddBtnClick" v-has="$g.add">添加部门 | 成员</el-button>
            <el-button  icon="el-icon-delete" type="danger" @click="handleUserDelBtnClick" v-has="$g.remove">删除</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="userList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          @selection-change="handleDepartUserTabSelect"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="名称" prop="name">
            <template slot-scope="scope">
              <el-tag type="success">
                <i class="el-icon-user" v-if="_.eq(scope.row.type, 'user')"/>
                <i class="el-icon-office-building" v-else/>
                <span style="padding-left: 5px">{{ scope.row.name }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog v-el-drag-dialog title="添加部门 | 成员" :visible.sync="dialogVisible" show-close width="45%">
      <department-tree-select @input="handleTreeSelectInput" :disable-branch-nodes="false" :value="selectTreeValues"></department-tree-select>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" icon="el-icon-error">取 消</el-button>
          <el-button type="primary" icon="el-icon-circle-check" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import DepartmentTreeSelect from "@/components/DepartmentTreeSelect/index";
  import {getTagList, getTagUsers, delTagUsers, addTagUsers} from '@/api/tag'
  import {mapGetters} from 'vuex'
  import {memberToTree} from "@/utils/treeSelect";
  export default {
    name: "TagUser",
    data() {
      return {
        tagList: [],
        userList: [],
        queryForm: {
          tagId: ''
        },
        listLoading: false,
        selectTagUsers: [],
        dialogVisible: false,
        selectTreeOptions: [],
        selectTreeValues: []
      }
    },
    components: {
      Pagination,
      DepartmentTreeSelect
    },
    created() {
      this.listLoading = true
      this.initData()
    },
    mounted() {
      this.listLoading = false
    },
    computed: {
      ...mapGetters([
        'currentCorp'
      ])
    },
    methods: {
      initData() {
        // console.log("tag init data")
        this.initTagList()
      },
      async initTagList() {
        let res = await getTagList(this.currentCorp.id)
        this.tagList = res
        this.queryForm.tagId = res[0].tagId
        // console.log("initTagList: ", res)
        await this.handleTagSelectChange()
      },
      async handleTagSelectChange() {
        let {depart_infoes,members} = await getTagUsers({tagId: this.queryForm.tagId, corpId: this.currentCorp.id})
        let memberList = members.map(x => {
          let ret = {}
          ret.id = x.jobId
          ret.name = x.name
          ret.departmentName = x.departmentName
          ret.departmentId = x.departmentId
          ret.type = 'user'
          return ret
        })

        let departList = depart_infoes.map(x => {
          let ret = {}
          ret.id = x.subordinateId
          ret.name = x.subordinateName
          ret.departmentName = x.superiorName
          ret.departmentId = x.superiorId
          ret.type = 'depart'
          return ret
        })
        this.userList = _.concat(memberList, departList)
        // console.log("handleTagSelectChange: ", members, depart_infoes)
      },
      handleDepartUserTabSelect(data) {
        this.selectTagUsers = data
      },
      handleUserAddBtnClick() {
        if (_.isNull(this.queryForm.tagId) || _.isEmpty(this.queryForm.tagId)) {
          this.$notify.info("请选择标签")
          return
        }
        this.selectTreeValues = _.map(this.userList, memberToTree)
        // console.log("handleUserAddBtnClick userList: ",this.userList)
        // console.log("handleUserAddBtnClick selectTreeValues: ",this.selectTreeValues)
        this.dialogVisible = true
      },
      submitForm() {
        if (_.isNull(this.selectTreeOptions) || _.isEmpty(this.selectTreeOptions)) {
          this.$notify.info("请选择要添加的部门或成员")
          return
        }

        let params = {
          tagId: this.queryForm.tagId,
          corpId: this.currentCorp.id,
          userIdList: this.selectTreeOptions.filter(f => _.eq(f.type, 'user')).map(x => x.jobId),
          partyList: this.selectTreeOptions.filter(f => _.eq(f.type, 'depart')).map(x => x.id),
        }
        // console.log("submitForm: ", params)

        addTagUsers(params).then(res => {
          this.$notify({
            type: 'success',
            title: "添加成员",
            position: 'top-right',
            message: '添加成功',
            showClose: false,
            offset: 50,
            duration: 1000
          })
          this.handleTagSelectChange()
          this.dialogVisible =  false
        })
      },
      handleTreeSelectInput(data){
        // console.log("handleTreeSelectInput: ",data)
        this.selectTreeOptions = data
      },
      async handleUserDelBtnClick() {
        if (_.isEmpty(this.selectTagUsers)) {
          this.$notify.info("请选择要删除的部门或成员")
          return
        }
        let params = {
          tagId: this.queryForm.tagId,
          corpId: this.currentCorp.id,
          userIdList: this.selectTagUsers.filter(f => _.eq(f.type, 'user')).map(x => x.id),
          partyList: this.selectTagUsers.filter(f => _.eq(f.type, 'depart')).map(x => x.id),
        }
        // console.log(params)
        delTagUsers(params).then(() => {
          this.initData()
          this.$notify({
            type: 'success',
            title: "删除",
            position: 'top-right',
            message: '删除成功',
            showClose: false,
            offset: 50,
            duration: 1000
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
