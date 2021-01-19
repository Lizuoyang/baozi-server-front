<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" >
          <el-form-item label="角色名称">
            <el-input v-model="queryForm.roleName" placeholder="角色名称" clearable @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item label="角色编码">
            <el-input v-model="queryForm.roleCode" placeholder="角色编码" clearable @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="queryForm.isDelete" placeholder="状态" clearable>
              <el-option v-for="s in statusList" :key="s.value" :label="s.name" :value="s.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleUserEditBtnClick(null)" v-has="$g.add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="role.list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="主键" align="center" >
            <template slot-scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>
          <el-table-column label="角色名称" align="center" width="200">
            <template slot-scope="scope">
              {{ scope.row.roleName }}
            </template>
          </el-table-column>
          <el-table-column label="角色编码" width="200" align="center" >
            <template slot-scope="scope">
              <span>{{ scope.row.roleCode }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isDelete == true ? 'danger' : 'success'">{{ scope.row.isDelete == true ? '删除' : '正常'
                }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleUserEditBtnClick(scope.row)" v-has="$g.edit">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" :disabled="scope.row.isDelete" @click="handleUserDeleteBtnClick(scope.row.id)" v-has="$g.remove">删除</el-button>
              <el-button type="text" icon="el-icon-setting" size="small" :disabled="scope.row.isDelete" @click="handleAssignMenuBtnClick(scope.row)" v-has="$g.authority">权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination :total="role.total" :page.sync="role.listQuery.page" :limit.sync="role.listQuery.limit" @pagination="initData" />
      </el-footer>
    </el-container>
    <update-dialog :dialog="this.updDialog" ref="updateDialog"></update-dialog>
    <assign-menu-dialog :dialog="this.menuDialog" ref="assignDialog"></assign-menu-dialog>
  </el-card>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import {getRoleList, getRoleListPage, updateRole, getBindMenusByRoleId} from "@/api/role";
  import UpdateDialog from './components/UpdateDialog'
  import AssignMenuDialog from './components/AssignMenuDialog'
  import {getNavigationList} from '@/api/menu'
  import {roleMenuTreeSelectMapSquare} from '@/utils/treeSelect'
  export default {
    name: 'Role',
    data() {
      return {
        roleList: [],
        statusList: [
          {name: '全部', value: ""},
          {name: '正常', value: 0},
          {name: '删除', value: 1},
        ],
        queryForm: {
          roleName: "",
          roleCode: "",
          isDelete: ""
        },
        listLoading: true,
        updDialog: {
          visible: false,
          title: '',
          role: {
          }
        },
        menuDialog: {
          visible: false,
          title: '权限分配',
          menus: []
        },
        role: {
          list: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
      }
    },
    watch: {
      'updDialog.visible'(val) {
        if (!val) {
          this.initData()
        }
      }
    },
    components: {
      UpdateDialog,
      Pagination,
      AssignMenuDialog
    },
    mounted() {
      this.initData()
      this.initRoles()
    },
    methods: {
      async handleAssignMenuBtnClick(row) {
        this.menuDialog = {
          visible: false,
          title: '权限分配',
          menus: []
        }

        // 获取角色选中的菜单信息
        let bindMenuRes = await getBindMenusByRoleId(row.id);

        let params = {}
        let naviRes = await getNavigationList(params)
        let naviTree = _.map(naviRes.data, (item) => roleMenuTreeSelectMapSquare(item, bindMenuRes.data))

        this.menuDialog.roleId = row.id
        this.menuDialog.roleName = row.roleName
        this.menuDialog.roleCode = row.roleCode
        this.menuDialog.bindMenus = bindMenuRes.data.map(x => x.menuId)
        this.menuDialog.menus = naviTree
        this.menuDialog.visible = true
      },
      async initRoles() {
        let res = await getRoleList();
        if (res.code == 200 && res.data) {
          this.roleList = res.data
        }
      },
      initData(){
        this.queryForm.page = this.role.listQuery.page
        this.queryForm.limit = this.role.listQuery.limit
        this.listLoading = true
        getRoleListPage(this.queryForm).then(res =>{
          this.role.list = res.data.list
          this.role.total = res.data.total
          this.listLoading = false
        })
      },
      handleQueryFormSubmit(isreset){
        if (isreset) {
          this.queryForm = {
            roleName: "",
            roleCode: "",
            isDelete: ""
          }
        }
        this.initData();
      },
      async handleUserEditBtnClick(data){
        if (this.$refs.updateDialog.$refs.roleRuleForm) {
          this.$refs.updateDialog.$refs.roleRuleForm.clearValidate()
        }
        this.updDialog.role = {}
        this.updDialog.roleList = []
        if (_.isEmpty(data)) {
          this.updDialog.title = '新增角色';
          this.updDialog.role = {
            isDelete: false,
            roleSort: 1
          }
        } else {
          this.updDialog.title = '编辑角色';
          this.updDialog.role = _.cloneDeep(data)
        }
        this.updDialog.roleList = this.roleList
        this.updDialog.visible = true
      },
      async handleUserDeleteBtnClick(userId){
        this.$confirm('确定要删除此角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            id: userId,
            isDelete: true
          }
          const res = await updateRole(params)
        if (res.code == 200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
        this.initData()

        })
      },
    }
  }

</script>

