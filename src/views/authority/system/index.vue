<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="系统名称">
            <el-input v-model="queryForm.systemName" placeholder="系统名称" clearable @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item label="系统编码">
            <el-input v-model="queryForm.systemCode" placeholder="系统编码" clearable @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="queryForm.isDelete" placeholder="状态" clearable>
              <el-option v-for="s in statusList" :key="s.value" :label="s.name" :value="s.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleSystemEditBtnClick(null)" v-has="$g.add">新增
            </el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="system.list"
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
          <el-table-column label="系统名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.systemName }}
            </template>
          </el-table-column>
          <el-table-column label="系统编码" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.systemCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="显示顺序" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.systemSort }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isDelete == true ? 'danger' : 'success'">{{ scope.row.isDelete == true ? '删除' :
                '正常'
                }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleSystemEditBtnClick(scope.row)" v-has="$g.edit">编辑
              </el-button>
              <el-button type="text" icon="el-icon-delete" size="small" :disabled="scope.row.isDelete"
                         @click="handleSystemDeleteBtnClick(scope.row.id)" v-has="$g.remove">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination :total="system.total" :page.sync="system.listQuery.page" :limit.sync="system.listQuery.limit"
                    @pagination="initData"/>
      </el-footer>
    </el-container>
    <update-dialog :dialog="this.updDialog" ref="updateDialog"></update-dialog>
  </el-card>
</template>

<script>
  import Pagination from "@/components/Pagination/index";
  import UpdateDialog from './components/UpdateDialog'
  import {getPageSystemMenuList, saveOrUpdateSystem} from '@/api/system'

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
          systemName: "",
          systemCode: "",
          isDelete: ""
        },
        listLoading: true,
        updDialog: {
          visible: false,
          title: '',
          system: {}
        },
        system: {
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
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.queryForm.page = this.system.listQuery.page
        this.queryForm.limit = this.system.listQuery.limit
        this.listLoading = true
        getPageSystemMenuList(this.queryForm).then(res => {
          this.system.list = res.data.list
          this.system.total = res.data.total
          this.listLoading = false
        })
      },
      handleQueryFormSubmit(isreset) {
        if (isreset) {
          this.queryForm = {
            systemName: "",
            systemCode: "",
            isDelete: ""
          }
        }
        this.initData();
      },
      async handleSystemEditBtnClick(data) {
        if (this.$refs.updateDialog.$refs.systemRuleForm) {
          this.$refs.updateDialog.$refs.systemRuleForm.clearValidate()
        }
        this.updDialog.system = {}
        if (_.isEmpty(data)) {
          this.updDialog.title = '新增系统';
          this.updDialog.system = {
            isDelete: false,
            systemSort: 1
          }
        } else {
          this.updDialog.title = '编辑系统';
          this.updDialog.system = _.cloneDeep(data)
        }
        this.updDialog.visible = true
      },
      async handleSystemDeleteBtnClick(systemId) {
        this.$confirm('确定要删除此系统吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            id: systemId,
            isDelete: true
          }
          const res = await saveOrUpdateSystem(params)
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
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

