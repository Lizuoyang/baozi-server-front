<template>
  <el-dialog :title="dialog.title" :visible="dialog.visible" show-close width="50%" @close="dialog.visible = false" top="5vh">
    <el-container style="height: 500px;">
      <el-header style="height: 10px">
        <span style="font-weight: bold;">角色名称: {{dialog.roleName + '(' + dialog.roleCode + ')'}}</span>
      </el-header>
      <el-main>
        <el-tree
          ref="assignMenuTree"
          :data="dialog.menus"
          show-checkbox
          :highlight-current="true"
          node-key="id"
          :default-checked-keys="dialog.bindMenus"
          default-expand-all
          :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <i  v-if="_.startsWith(_.split(node.label, '+')[0], 'el')" :class="_.split(node.label, '+')[0]"/>
        <svg-icon v-else :icon-class="_.split(node.label, '+')[0]" class-name="disabled"/>
        <span style="margin-left: 5px; margin-right: 20px">{{ _.split(node.label, '+')[1] }}</span>
        <el-checkbox-group v-model="data.checkedOperation"  style="float: right; padding: 0px" @change="() => handleCheckboxGroupChange(node)">
          <el-checkbox size="mini" v-for="item in data.operations" :label="item.id" :key="item.id">{{item.operationName}}</el-checkbox>
        </el-checkbox-group>
      </span>
        </el-tree>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitAssignMenuForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {assignMenu} from '@/api/role'
  export default {
    name: 'AssignMenuDialog',
    data() {
      return {
      }
    },
    props: {
      dialog: {
        type: Object,
        default: null
      }
    },
    methods: {
      handleCheckboxGroupChange(node) {
        if (!node.checked) {
          node.checked = true
        }
      },
      checkNodeMapSquare(item, all) {
        let findOp = _.find(all, {id: item})
        return _.result(findOp, 'operationCode', '')
      },
      async submitAssignMenuForm() {
        let checkNodes = _.concat(this.$refs.assignMenuTree.getCheckedNodes(), this.$refs.assignMenuTree.getHalfCheckedNodes())
        let params = checkNodes.map(mp => {
          let res = {
            roleId: this.dialog.roleId,
            menuId: mp.id,
            operationList: _.map(mp.checkedOperation, (item) => this.checkNodeMapSquare(item, mp.operations)).join(",")
          }
          return res
        })
        let saveRes = await assignMenu(params)
        let result = saveRes.data
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
      }
    }
  }
</script>


<style scoped>
  .el-checkbox {
    margin-right: 10px;
  }
</style>
