<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="图片名称">
            <el-input v-model="queryForm.title" placeholder="请输入图片名称" clearable @clear="initData()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="initData()">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleMaterialEditBtnClick(null)">新增
            </el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleMaterialDeleteBtnClick()">删除</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          ref="materialText"
          @selection-change="handleSelectionChange"
          :data="textData"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row>
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column
            prop="title"
            align="center"
            label="图片名称"
            width="180">
          </el-table-column>
          <el-table-column align="center" prop="linkUrl" label="图片">
            <template slot-scope="scope">
              <el-popover placement="left" title="" trigger="hover">
                <img :src="scope.row.linkUrl" alt="" style="width: 150px;height: 150px">
                <img slot="reference" :src="scope.row.linkUrl" :alt="scope.row.name"
                     style="max-height: 60px;max-width: 60px">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdBy"
            align="center"
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="createdTime"
            align="center"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="updatedBy"
            align="center"
            label="修改人">
          </el-table-column>
          <el-table-column
            prop="updatedTime"
            align="center"
            label="修改时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleMaterialEditBtnClick(scope.row)">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination :total="material.total" :page.sync="material.listQuery.page" :limit.sync="material.listQuery.limit"
                    @pagination="initData"/>
      </el-footer>
    </el-container>
    <update-dialog :dialog="this.updDialog" ref="updateDialog"></update-dialog>
  </el-card>
</template>
<script>
  import UpdateDialog from './components/UpdateDialog'
  import Pagination from '@/components/Pagination/index'
  import { getTextList } from '@/api/material'
  import { deleteMaterial } from '@/api/material'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        multipleSelection: [],
        updDialog: {
          visible: false,
          title: '',
          material: {}
        },
        queryForm: {
          type: 'image',
          brandCode: '',
          title: '',
          corpId: ''
        },
        textData: [],
        listLoading: false,
        material: {
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentCorp',
        'user'
      ])
    },
    created() {
      this.queryForm.corpId = this.currentCorp.id
      this.initData()
    },
    components: {
      Pagination,
      UpdateDialog
    },
    watch: {
      'updDialog.visible'(val) {
        if (!val) {
          this.initData()
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      //删除
      handleMaterialDeleteBtnClick() {
        let textIdList = []
        if (this.multipleSelection === undefined || this.multipleSelection.length == 0) {
          this.$message({
            type: 'error',
            message: '请选择要删除的图片素材!'
          })
        } else {
          this.$confirm('确定要删除选择的素材吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            textIdList = this.multipleSelection.map(el => el.id)
            const res = await deleteMaterial(textIdList)
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.initData()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        }
      },
      //新增
      async handleMaterialEditBtnClick(data) {
        if (this.$refs.updateDialog.$refs.materialRuleForm) {
          this.$refs.updateDialog.$refs.materialRuleForm.clearValidate()
        }
        if (_.isEmpty(data)) {
          this.updDialog.title = '新增图片素材'
          this.updDialog.material = {}
        } else {
          this.updDialog.title = '编辑图片素材'
          this.updDialog.material = _.cloneDeep(data)
        }
        this.updDialog.visible = true
      },
      //初始数据
      initData() {
        this.queryForm.page = this.material.listQuery.page
        this.queryForm.limit = this.material.listQuery.limit
        getTextList(this.queryForm).then(res => {
          this.textData = res.data.list
          this.material.total = res.data.total
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
