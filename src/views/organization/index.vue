<template>
  <el-card class="box-card">
    <el-container>
      <el-main style="margin-top: 30px">
        <el-table
          height="550"
          style="cursor: pointer"
          v-loading="listLoading"
          :data="treeOptions"
          row-key="id"
          element-loading-text="加载中"
          border
          lazy
          fit
          ref="orgTreeTable"
          highlight-current-row
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @row-click="handleMenuTableClick"
        >
          <el-table-column align="left" prop="label">
            <template slot="header" slot-scope="scope">
              <el-button type="text" style="margin-left: 50px" v-if="allExpand" @click="toggleRowExpansion(false)">全部折叠</el-button>
              <el-button type="text" style="margin-left: 50px" v-else @click="toggleRowExpansion(true)">全部展开</el-button>
            </template>
            <template slot-scope="scope">
              <el-tag type="success">
                <i class="el-icon-office-building"/>
                <span style="padding-left: 5px; color: black">{{ scope.row.label }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleOrgEditBtnClick(scope.row, 'upd')" v-has="$g.edit">编辑</el-button>
              <el-button type="text" icon="el-icon-circle-plus-outline" @click="handleOrgEditBtnClick(scope.row, 'add')" v-has="$g.add">添加</el-button>
              <el-button type="text" icon="el-icon-delete" @click="handleOrgDelBtnClick(scope.row)" v-has="$g.remove">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
    <el-dialog v-el-drag-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="30%" ref="orgDialog">
      <el-form :inline="false" class="demo-form-inline" :model="dialog.org" :rules="orgRules" ref="orgRuleForm"
               label-width="100px">
        <el-form-item label="部门名称:" prop="label">
          <el-input v-model="dialog.org.label" placeholder="请输入部门名称" style="width: 90%"></el-input>
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
  import {getDepartTreeList} from '@/api/department'
  import {departmentTreeMapSquare} from "@/utils/treeSelect";
  import {mapGetters} from 'vuex'
  import {updateDepart, addDepart, deleteDepart} from '@/api/department'
  export default {
    name: "index",
    data(){
      return {
        allExpand: false,
        treeOptions: [],
        listLoading: false,
        expandRowKeys: [],
        orgRules: {
          label: [
            {required: true, message: '请输入部门名称', trigger: 'blur'},
          ]
        },
        dialog: {
          org: {},
          title: "",
          visible: false
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
      this.initData()
    },
    methods: {
      submitForm() {
        this.$refs['orgRuleForm'].validate(async valid => {
          if (valid) {
            this.dialog.org.corpId = this.currentCorp.id
            this.dialog.org.name = this.dialog.org.label
            console.log(this.dialog.org)
            let result = true
            if (_.eq(this.dialog.type, 'add')) {
              result = await addDepart(this.dialog.org)
            } else {
              result = await updateDepart(this.dialog.org)
            }
            await this.initData()
            this.dialog.visible = !result;
            this.$notify({
              type: result ? 'success' : 'error',
              title: this.dialog.title,
              position: 'top-right',
              message: result ? '操作成功' : '操作失败',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          } else {
            return false;
          }
        })
      },
      handleOrgDelBtnClick(row) {
        console.log(row)
        this.$confirm('确定要删除此部门吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          deleteDepart({departmentId: row.id, corpId : this.currentCorp.id}).then(async () => {
            await this.initData()
            this.$notify({
              type: 'success',
              title: this.dialog.title,
              position: 'top-right',
              message: '删除成功',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          })
        })
      },
      handleOrgEditBtnClick(row,action) {
        this.dialog.org = {}
        this.dialog.type = action
        if (this.$refs.orgDialog.$refs.orgRuleForm) {
          this.$refs.orgDialog.$refs.orgRuleForm.clearValidate()
        }

        if (_.eq(action, 'add')) {
          this.dialog.title = "添加子部门"
          this.dialog.org.parentId = row.id
          this.dialog.org.brandCode = row.brandCode
          this.dialog.org.brandName = row.brandName
          this.dialog.org.createdBy = this.user.loginName
        } else {
          this.dialog.org = _.cloneDeep(row)
          this.dialog.title = "修改部门"
          this.dialog.org.updatedBy = this.user.loginName
        }
        this.dialog.visible = true
      },
      toggleRowExpansion(isExpansion) {
        this.listLoading = true
        this.allExpand = isExpansion
        this.toggleRowExpansion_forAll(this.treeOptions,isExpansion);
        this.listLoading = false
      },
      toggleRowExpansion_forAll(data,isExpansion){
        data.forEach(item => {
          this.$refs.orgTreeTable.toggleRowExpansion(item,isExpansion);
          if(item.children != undefined && item.children != null){
            this.toggleRowExpansion_forAll(item.children,isExpansion);
          }
        })
      },
      handleMenuTableClick(row, column, event) {
        if (_.eq("操作", column.label)) {
          return
        }

        this.$refs['orgTreeTable'].toggleRowExpansion(row, this.expandRowKeys.indexOf(row.id) == -1);
        if (this.expandRowKeys.indexOf(row.id) == -1) {
          this.expandRowKeys.push(row.id);
        } else {
          this.expandRowKeys.splice(0, this.expandRowKeys.length)
        }
      },
      async initData() {
        this.listLoading = true
        let data = await getDepartTreeList({
          corpId: this.currentCorp.id
        })
        this.treeOptions = _.map(data, departmentTreeMapSquare)
        console.log("initData: ", this.treeOptions)
        this.listLoading = false
      }
    }
  }
</script>

<style scoped>

</style>
