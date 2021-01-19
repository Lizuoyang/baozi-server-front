<template>
  <el-dialog v-el-drag-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="45%">
    <el-form :inline="true" class="demo-form-inline" :model="dialog.menu" :rules="menuRules" ref="menuRuleForm"
             label-width="100px">
      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="菜单名称:" prop="menuName">
            <el-input v-model="dialog.menu.menuName" placeholder="请输入菜单名称">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型:" prop="menuType">
            <el-select v-model="dialog.menu.menuType" placeholder="请选择菜单类型">
              <el-option v-for="item in menuTypeList" :label="item.name" :value="item.value"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="URL路径:" prop="menuUrl">
            <el-input v-model="dialog.menu.menuUrl" placeholder="请输入访问URL路径">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序:" prop="menuSort">
            <el-input-number v-model="dialog.menu.menuSort" :min="1" :max="100" controls-position="right" label="显示顺序"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="所属系统:" prop="systemId">
            <el-select v-model="dialog.menu.systemId" placeholder="请选择所属系统" clearable filterable @change="handleMenuSystemSelectChange">
              <el-option v-for="sys in systemMenus" :key="sys.id" :label="sys.systemName"
                         :value="sys.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级菜单:" prop="parentId">
            <treeselect v-model="dialog.menu.parentId" size="small"
                        placeholder="请选择上级菜单"
                        noOptionsText="暂无数据"
                        :options="navigations"
                        :searchable="false"
                        :defaultExpandLevel="3"
                        style="width: 190px">
              <div slot="value-label" slot-scope="{ node }">
                <i  v-if="_.startsWith(_.split(node.label, '+')[0], 'el')" :class="_.split(node.label, '+')[0]"/>
                <svg-icon v-else :icon-class="_.split(node.label, '+')[0]" class-name="disabled"/>
                <span style="margin-left: 5px">{{ _.split(node.label, '+')[1] }}</span>
              </div>
              <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
                     :class="labelClassName">
                <i  v-if="_.startsWith(_.split(node.label, '+')[0], 'el')" :class="_.split(node.label, '+')[0]"/>
                <svg-icon v-else :icon-class="_.split(node.label, '+')[0]" class-name="disabled"/>
                <span style="margin-left: 5px">{{ _.split(node.label, '+')[1] }}</span>
              </label>
            </treeselect>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="12">
          <el-form-item label="是否显示:" prop="isDelete">
            <el-switch v-model="dialog.menu.isDelete"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="选择图标:">
            <el-popover
              placement="right"
              title="选择图标"
              width="600"
              trigger="hover"
              v-model="iconPopoverVisible"
            >
              <div v-for="item in svgIcons" style="float: left; padding: 5px;cursor:pointer;"
                   @click="handleSelectIcon(item)">
                <svg-icon :icon-class="item" class-name="disabled"/>
              </div>
              <div v-for="item in elementIcons" style="float: left; padding: 5px;cursor:pointer;"
                   @click="handleSelectIcon('el-icon-' + item)">
                <i :class="'el-icon-' + item"/>
              </div>
              <el-button slot="reference" :icon="iconPopoverSelected" round
                         @click="iconPopoverVisible = !iconPopoverVisible">
                <svg-icon v-show="!_.startsWith(iconPopoverSelected, 'el-')" :icon-class="iconPopoverSelected"
                          class-name="disabled"/>
              </el-button>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutters="20" v-if="dialog.menu.menuType == 'menu'">
        <el-form-item label="按钮权限:" prop="operation">
          <template slot-scope="scope">
            <el-checkbox-group v-model="checkedOperations" @change="handleCheckedOperationChange" style="width: 500px">
              <el-checkbox v-for="item in dialog.operationList" :label="item.id"  :key="item.id">{{item.operationName}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-row>

      <el-row :gutters="20">
        <el-col :span="24">
          <el-form-item label="菜单备注:" prop="remark">
            <el-input
              style="width: 300%;"
              type="textarea"
              placeholder="请输入内容"
              v-model="dialog.menu.remark"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" icon="el-icon-circle-check" @click="submitMenuForm">确 定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import IconSelect from '@/components/Icon/index'
  import svgIcons from '@/components/Icon/svg-icons'
  import elementIcons from '@/components/Icon/element-icons'
  import {mapGetters} from 'vuex'
  import {getNavigationList, updateMenu} from '@/api/menu'

  // import the component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {treeSelectMapSquare} from '@/utils/treeSelect'

  export default {
    name: "UpdateDialog.vue",
    data() {
      return {
        checkedOperations: [],
        menuRules: {
          menuName: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
          ],
          menuUrl: [
            {required: true, message: '请输入菜单URL地址', trigger: 'blur'},
          ],
          systemId: [
            {required: true, message: '请选择所属系统', trigger: 'blur'},
          ],
          parentId: [
            {required: true, message: '请选择上级菜单', trigger: 'blur'},
          ],
        },
        svgIcons,
        elementIcons,
        iconPopoverVisible: false,
        iconPopoverSelected: 'el-icon-s-promotion',
        menuTypeList: [
          {name: '导航', value: 'navigation'},
          {name: '菜单', value: 'menu'},
        ],
        navigations: []
      }
    },
    computed: {
      ...mapGetters([
        'systemMenus',
        'user'
      ])
    },
    components: {
      IconSelect,
      Treeselect
    },
    created() {

    },
    methods: {
      handleCheckedOperationChange(value) {
        this.dialog.menu.operationIds = value
      },
      async handleMenuSystemSelectChange(row){
        let params = {
          systemId: row,
          menuType: 'navigation'
        }
        let treeSelRes = await getNavigationList(params)
        this.navigations = _.map(treeSelRes.data, treeSelectMapSquare)
        this.navigations.splice(0, 0, {id: 0, label: 'menu+根节点'})
      },
      submitMenuForm() {
        this.$refs['menuRuleForm'].validate(async valid => {
          if (valid) {
            let params = _.cloneDeep(this.dialog.menu)
            params.actionBy = this.user.loginName
            params.operationIds = this.checkedOperations
            console.log(params)
            let updRes = await updateMenu(params);
            let result = updRes.data
            this.dialog.visible = !result
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
            return false;
          }
        })
      },
      handleSelectIcon(data) {
        this.dialog.menu.menuIcon = data
        this.iconPopoverSelected = data
        // 关闭icon选择框
        this.iconPopoverVisible = false
      },
      generateIconCode(symbol) {
        return `<svg-icon icon-class="${symbol}" />`
      },
    },
    props: {
      dialog: {
        type: Object,
        default: () => {
        }
      }
    }
  }
</script>

<style scoped>

</style>
