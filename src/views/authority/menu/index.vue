<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="所属系统:">
            <el-select v-model="queryForm.systemId" placeholder="所属系统" filterable>
              <el-option v-for="sys in systems" :key="sys.id" :label="sys.systemName"
                         :value="sys.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="菜单名称:">
            <el-input v-model="queryForm.menuName" clearable placeholder="菜单名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="handleQueryFormSubmit(true)">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQueryFormSubmit(false)">查询</el-button>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="handleMenuEditBtnClick(null)" v-has="$g.add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="menu.navigations"
          height="450"
          row-key="id"
          element-loading-text="加载中"
          border
          lazy
          fit
          ref="menuTreeTable"
          highlight-current-row
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @row-click="handleMenuTableClick"
        >
          <el-table-column align="left" prop="menuName">
            <template slot="header" slot-scope="scope">
              <el-button type="text" style="margin-left: 50px" v-if="allExpand" @click="toggleRowExpansion(false)">全部折叠</el-button>
              <el-button type="text" style="margin-left: 50px" v-else @click="toggleRowExpansion(true)">全部展开</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="类型" >
            <template slot-scope="scope">
              <el-tag effect="dark" :type="menuType[scope.row.menuType].type" :key="menuType[scope.row.menuType].label" :label="menuType[scope.row.menuType].label" >{{menuType[scope.row.menuType].label}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图标">
            <template slot-scope="scope">
              <i :class="scope.row.menuIcon" v-if="_.startsWith(scope.row.menuIcon, 'el')"/>
              <svg-icon :icon-class="scope.row.menuIcon" v-else/>
            </template>
          </el-table-column>
          <el-table-column align="left" label="URL" prop="menuUrl"></el-table-column>
          <el-table-column align="center" label="显示顺序" prop="menuSort"></el-table-column>
          <el-table-column align="center" label="是否显示">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isDelete" @change="(item) => handleMenuStatusSwitch(item,scope.row)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="small" @click="handleMenuEditBtnClick(scope.row)" v-has="$g.edit"
              >编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
    <update-dialog ref="updDialog" :dialog="dialog"></update-dialog>
  </el-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { getNavigationList, setMenuShow } from '@/api/menu'
  import UpdateDialog from './components/UpdateDialog'
  import {treeSelectMapSquare} from "@/utils/treeSelect";
  import {getOperationList} from '@/api/operation'

  export default {
    name: 'MenuManager',
    data() {
      return {
        menu: {
          navigations: [],
          total: 0,
          listQuery: {
            page: 1,
            limit: 10
          }
        },
        listLoading: false,
        queryForm: {
          systemId: "",
          menuName: ""
        },
        menuType: {
          navigation: {type: 'danger', label: '导航'},
          menu: {type: 'warning', label: '菜单'}
        },
        expandRowKeys: [],
        allExpand: false,
        dialog: {
          visible: false,
          menu: {}
        }
      }
    },
    components: {
      UpdateDialog
    },
    computed: {
      ...mapGetters({
        systems: 'systemMenus',
        currentSystemId: 'activeTab'
      })
    },
    created() {
      this.queryForm.systemId = this.currentSystemId
      this.initNavigation()
    },
    watch: {
      'dialog.visible'(val) {
        if (!val) {
          this.initNavigation()
        }
      }
    },
    methods: {
      async handleMenuStatusSwitch(data,row) {
        let childMenus = _.get(row, 'children', [])
        let params = {
          id: _.get(row, 'id', null),
          menuType: _.get(row, 'menuType', null),
          isDelete: _.get(row, 'isDelete', null),
          childrenIds: childMenus.map(x => x.id),
        }
        this.listLoading = true
        let updRes = await setMenuShow(params);
        if (updRes.data) {
          await this.initNavigation()
          this.listLoading = false
        }
      },
      toggleRowExpansion(isExpansion){
        this.allExpand = isExpansion
        let menus = this.menu.navigations.filter(x => _.eq(x.menuType, 'navigation'))
        this.toggleRowExpansion_forAll(menus,isExpansion);
      },
      toggleRowExpansion_forAll(data,isExpansion){
        data.forEach(item => {
          this.$refs.menuTreeTable.toggleRowExpansion(item,isExpansion);
          if(item.children != undefined && item.children != null){
            this.toggleRowExpansion_forAll(item.children,isExpansion);
          }
        })
      },
      handleMenuTableClick(row, column, event){
        if (_.eq("是否显示", column.label) || _.eq("操作", column.label)) {
          return
        }

        this.$refs['menuTreeTable'].toggleRowExpansion(row, this.expandRowKeys.indexOf(row.id) == -1);
        if (this.expandRowKeys.indexOf(row.id) == -1) {
          this.expandRowKeys.push(row.id);
        } else {
          this.expandRowKeys.splice(0, this.expandRowKeys.length)
        }
      },
      async initNavigation() {
        let params = {
          systemId: _.toString(this.queryForm.systemId),
          menuName: this.queryForm.menuName
        }
        let naRes = await getNavigationList(params)
        this.menu.navigations = naRes.data
      },
      handleQueryFormSubmit(isreset){
        if (isreset) {
          this.queryForm.systemId = this.currentSystemId
          this.queryForm.menuName = ""
          this.expandRowKeys = []
        }
        this.allExpand = false
        this.initNavigation()
      },
      async handleMenuEditBtnClick(data) {
        if (this.$refs.updDialog.$refs.menuRuleForm) {
          this.$refs.updDialog.$refs.menuRuleForm.clearValidate()
        }
        this.dialog.menu = {
          isDelete: false,
          menuSort: 1,
          menuType: 'navigation',
          operationIds: []
        }
        let opRes = await getOperationList({})
        this.dialog.operationList = opRes.data
        if (_.isEmpty(data)) {
          this.dialog.title = '新增菜单';
        } else {
          this.dialog.menu = _.cloneDeep(data)
          this.$refs['updDialog'].iconPopoverSelected = this.dialog.menu.menuIcon
          this.$refs['updDialog'].checkedOperations = this.dialog.menu.operations.map(x => x.id)

          let params = {
            systemId: this.dialog.menu.systemId,
            menuType: 'navigation'
          }
          let treeSelRes = await getNavigationList(params)
          this.$refs['updDialog'].navigations = _.map(treeSelRes.data, treeSelectMapSquare)
          this.$refs['updDialog'].navigations.splice(0, 0, {id: 0, label: 'menu+根节点'})

          this.dialog.title = '修改菜单';
        }
        this.dialog.visible = true;
      },

    }
  }
</script>
