<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="操作名称:">
            <el-input v-model="queryForm.operationName" clearable placeholder="操作名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleOperationEditBtnClick(null)" v-has="$g.add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="operation.list"
          height="500"
          row-key="id"
          element-loading-text="加载中"
          border
          lazy
          fit
          ref="operationTable"
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="操作名称" prop="operationName" align="center">
            <template slot-scope="scope">
              <el-tag type="success">
                {{scope.row.operationName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作编码" prop="operationCode" align="center"></el-table-column>
          <el-table-column label="排序" prop="operationSort" align="center"></el-table-column>

          <el-table-column align="center" label="操作" width="300" >
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleOperationEditBtnClick(scope.row)" v-has="$g.edit">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" size="small" @click="handleOperationDelBtnClick(scope.row)" v-has="$g.remove">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
    <el-dialog v-el-drag-dialog :title="dialog.title" ref="updDialog" :visible="dialog.visible" show-close width="30%"
               @close="dialog.visible = false">
      <el-form style="width: 400px" :model="dialog.operation" :rules="operationRules" ref="operationRuleForm"
               label-width="100px"
               class="demo-roleForm">
        <el-form-item label="操作名称：" prop="operationName">
          <el-input v-model="dialog.operation.operationName" placeholder="请输入操作名称"></el-input>
        </el-form-item>

        <el-form-item label="操作编码：" prop="operationCode">
          <el-input v-model="dialog.operation.operationCode" placeholder="请输入操作编码"></el-input>
        </el-form-item>

        <el-form-item label="显示顺序:" prop="operationSort">
          <el-input-number v-model="dialog.operation.operationSort" :min="1" :max="100" controls-position="right"
                           label="显示顺序"></el-input-number>
        </el-form-item>

        <el-form-item label="操作说明:">
          <el-input
            autosize
            type="textarea"
            style="width:100%"
            v-model="dialog.operation.operationDesc"
            placeholder="请输入操作说明">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
          <el-button type="primary" icon="el-icon-circle-check" @click="submitForm">确 定</el-button>
        </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import {getOperationList, updateOperation, addOperation, removeOperation} from '@/api/operation'
  import {mapGetters} from 'vuex'
  import {getOperationByCode} from '@/api/operation'
  export default {
    name: "index",
    data () {
      let validateCode = (rule, value, callback) => {
        getOperationByCode(value).then(result => {
          if (result.data != null && !_.eq(result.data.id, this.dialog.operation.id)) {
            callback(new Error('操作编码已存在'));
          } else {
            callback();
          }
        });
      }
      return {
        operationRules: {
          operationName: [
            { required: true, message: '请输入操作名称', trigger: 'blur' }
          ],
          operationCode: [
            { required: true, message: '请输入操作编码', trigger: 'blur' },
            {validator: validateCode, trigger: ['blur']},
          ]
        },
        dialog: {
          operation: {},
          title: "",
          visible: false
        },
        listLoading: false,
        operation: {
          list: []
        },
        queryForm: {
          operationName: "",
          operationCode: "",
          operationSort: 1,
          operationDesc: ""
        }
      }
    },
    created() {
      this.initData()
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      async initData() {
        this.listLoading = true
        let res = await getOperationList(this.queryForm);
        this.operation.list = res.data
        this.listLoading = false
      },
      handleOperationDelBtnClick(row) {
        this.$confirm('确定要删除此操作权限吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          removeOperation(row.id).then(async res => {
            await this.initData()
            this.$notify({
              type: 'success',
              title: "提示",
              position: 'top-right',
              message: '删除成功',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          })
        })
      },
      handleOperationEditBtnClick(row) {
        if (this.$refs.operationRuleForm) {
          this.$refs.operationRuleForm.clearValidate()
        }
        this.dialog.operation = {
          operationSort: 1,
        }
        if (row) {
          this.dialog.title = "编辑操作"
          this.dialog.type = "upd"
          this.dialog.operation = _.cloneDeep(row)
          this.iconPopoverSelected = this.dialog.operation.operationCode
        } else {
          this.dialog.title = "新增操作"
          this.dialog.type = "add"
        }
        this.dialog.visible = true
      },
      submitForm() {
        this.$refs['operationRuleForm'].validate(async valid => {
          if (valid) {
            this.dialog.operation.actionBy = this.user.loginName
            let result = true
            if (_.eq(this.dialog.type, 'add')) {
              result = await addOperation(this.dialog.operation)
            } else {
              result = await updateOperation(this.dialog.operation)
            }
            await this.initData()
            this.dialog.visible = !result;
            this.$notify({
              type: result ? 'success' : 'error',
              title: this.dialog.title,
              position: 'top-right',
              message: result ? '成功' : '失败',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          } else {
            return false
          }
        })
      },
      handleQueryFormSubmit(isreset) {
        if (isreset) {
          this.queryForm =  {
            operationName: ""
          }
        }
        this.initData()
      },
      handleSelectIcon(data) {
        this.dialog.operation.operationCode = data
        this.iconPopoverSelected = data
        // 关闭icon选择框
        this.iconPopoverVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
