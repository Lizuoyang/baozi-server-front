<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="用户名:">
            <el-input v-model="queryForm.userName" clearable placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="角色名:">
            <el-select v-model="queryForm.roleCode" placeholder="角色名" clearable>
              <el-option v-for="role in roleList" :key="role.id" :label="role.roleName"
                         :value="role.roleCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="queryForm.isDelete" placeholder="状态" clearable>
              <el-option v-for="s in statusList" :key="s.value" :label="s.name" :value="s.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)" >查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleUserEditBtnClick(null)" v-has="$g.add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="user.list"
          element-loading-text="加载中"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">
              {{ scope.row.loginName }}
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center" >
            <template slot-scope="scope">
              {{ scope.row.userName }}
            </template>
          </el-table-column>
          <el-table-column label="角色名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别"  align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sex == '0' ? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.email" placement="top-start">
                <span>{{ _.truncate(scope.row.email, {'length': 10}) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="注册时间">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              <span>{{ scope.row.registerDate }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isDelete == true ? 'danger' : 'success'">{{ scope.row.isDelete == true ? '删除' : '正常'
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleUserEditBtnClick(scope.row)">编辑
              </el-button>
              <el-button v-if="!scope.row.status" icon="el-icon-delete" type="text" size="small"
                         @click="handleUserDeleteBtnClick(scope.row.id)" :disabled="scope.row.isDelete">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination v-show="user.total>0" :total="user.total" :page.sync="user.listQuery.page"
                    :limit.sync="user.listQuery.limit" @pagination="initData"/>
      </el-footer>
    </el-container>
    <update-dialog ref="updDialog" :dialog="this.dialog"></update-dialog>
  </el-card>
</template>

<script>
  import {getUserList, updateUser, getCorps} from '@/api/user'
  import {getOperationList} from '@/api/operation'
  import {getRoleList} from '@/api/role'
  import Pagination from '@/components/Pagination'
  import UpdateDialog from './components/UpdateDialog'
  import {mapGetters} from 'vuex'

  export default {
    name: 'User',
    components: {
      Pagination,
      UpdateDialog
    },
    data() {
      return {
        dialog: {
          visible: false,
          title: '',
          user: {}
        },
        queryForm: {
          userName: "",
          roleCode: "",
          isDelete: ""
        },
        user: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        roleList: [],
        corpList: [],
        listLoading: true,
        statusList: [
          {name: '全部', value: ""},
          {name: '正常', value: 0},
          {name: '删除', value: 1},
        ]
      }
    },
    watch: {
      'dialog.visible'(val) {
        if (!val) {
          this.initData()
        }
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'user'
      })
    },
    mounted() {
      this.initData();
      this.initRoles();
    },
    methods: {
      handleQueryFormSubmit(isreset) {
        if (isreset) {
          this.queryForm = {
            userName: "",
            roleCode: "",
            isDelete: ""
          }
        }
        this.initData();
      },
      async handleUserEditBtnClick(data) {
        if (this.$refs.updDialog.$refs.userRuleForm) {
          this.$refs.updDialog.$refs.userRuleForm.clearValidate()
        }
        this.dialog.user = {
          sex: "0",
          isDelete: false
        }
        this.dialog.roleList = []
        let selectedUser = _.cloneDeep(data)
        if (_.isEmpty(selectedUser)) {
          this.dialog.title = '新增用户';
        } else {
          this.dialog.title = '编辑用户';
          selectedUser.phone = parseInt(selectedUser.phone)
          selectedUser.corpIds = selectedUser.corps.map(x => x.corpId)
          this.dialog.user = selectedUser

        }
        this.dialog.roleList = this.roleList
        this.dialog.corpList = await this.getCorpList()
        this.dialog.visible = true

      },
      async handleUserDeleteBtnClick(userId) {
        this.$confirm('确定要删除此用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            id: userId,
            isDelete: 1
          }
          let delRes = await updateUser(params)
          if (delRes.data) {
            this.initData();
          }
          this.$message({
            type: delRes.data ? 'success' : 'error',
            message: delRes.data ? '删除成功!' : '删除失败!'
          });
        })
      },
      async getCorpList() {
        let {data} = await getCorps()
        return data
      },
      async initRoles() {
        let res = await getRoleList();
        if (res.code == 200 && res.data) {
          this.roleList = res.data
        }
      },
      initData() {
        this.queryForm.page = this.user.listQuery.page
        this.queryForm.limit = this.user.listQuery.limit
        this.listLoading = true
        getUserList(this.queryForm).then(response => {
          console.log(response)
          this.user.list = response.data.list.filter(x => x.id !== this.currentUser.id)
          this.user.total = response.data.list.filter(x => x.id == this.currentUser.id) == null ? response.data.total : response.data.total - 1
          this.listLoading = false
        })
      }
    }
  }
</script>
