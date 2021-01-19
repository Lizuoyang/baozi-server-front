<template>
  <el-card class="box-card">
    <el-container>
      <el-main style="margin-top: 30px">
        <el-table
          v-loading="listLoading"
          height="500"
          :data="tagList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot="header" slot-scope="scope">
              <el-button type="text" icon="el-icon-circle-plus-outline" @click="handleTagEditBtnClick(null)" v-has="$g.add">添加</el-button>
            </template>
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="标签名称" prop="tagName" align="center">
            <template slot-scope="scope">
              <el-tag type="success">
                {{scope.row.tagName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleTagEditBtnClick(scope.row)" v-has="$g.edit">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" @click="handleTagDelBtnClick(scope.row)" v-has="$g.remove">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog v-el-drag-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="30%" ref="tagDialog">
      <el-form :inline="false" class="demo-form-inline" :model="dialog.tag" :rules="tagRules" ref="tagRuleForm"
               label-width="100px">
        <el-form-item label="部门名称:" prop="tagName">
          <el-input v-model="dialog.tag.tagName" placeholder="请输入标签名称" style="width: 90%"></el-input>
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
  import {getTagList, addTag, updateTag, deleteTag} from "@/api/tag";
  import {mapGetters} from 'vuex'
  import {deleteDepart} from "@/api/department";
  export default {
    name: "index",
    data () {
      return {
        tagRules: {
          tagName: [
            {required: true, message: '请输入标签名称', trigger: 'blur'},
          ]
        },
        dialog:{
          title: "",
          visible: false,
          tag: {
            tagName: ""
          }
        },
        tagList: [],
        listLoading: false
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
        this.$refs['tagRuleForm'].validate(async valid => {
          if (valid) {
            this.dialog.tag.corpId = this.currentCorp.id
            console.log(this.dialog.tag)
            let result = true
            if (_.eq(this.dialog.type, 'upd')) {
              this.dialog.tag.updatedBy = this.user.loginName
              result = await updateTag(this.dialog.tag)
            } else {
              this.dialog.tag.createdBy = this.user.loginName
              result = await addTag(this.dialog.tag)
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
      handleTagEditBtnClick(row) {
        if (this.$refs.tagDialog.$refs.tagRuleForm) {
          this.$refs.tagDialog.$refs.tagRuleForm.clearValidate()
        }
        if (row) {
          this.dialog.tag = row
          this.dialog.title = "修改标签";
          this.dialog.type = "upd";
        } else {
          this.dialog.tag = {}
          this.dialog.title = "新增标签";
          this.dialog.type = "add"
        }
        this.dialog.visible = true;
      },
      handleTagDelBtnClick(row) {
        this.$confirm('确定要删除此标签吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = _.cloneDeep(row)
          params.corpId = this.currentCorp.id
          params.updatedBy = this.user.loginName
          deleteTag(params).then(async () => {
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
      async initData() {
        this.listLoading = true
        let res = await getTagList(this.currentCorp.id)
        console.log(res)
        this.tagList = res
        this.listLoading = false
      },
    }
  }
</script>

<style scoped>

</style>
