<-- 企业文化君-->
<template>
  <el-card class="box-card">
    <el-container>
      <el-header class="dashboard-head">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline">
          <el-form-item label="标题:">
            <el-input
              v-model="queryForm.title"
              clearable
              placeholder="请输入标题"
              @clear="initData"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select
              v-model="queryForm.type"
              placeholder="类型"
              clearable
              filterable
              @clear="initData"
            >
              <el-option
                v-for="type in typeList"
                :key="type.value"
                :label="type.name"
                :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="resetBtn()"
            >重置</el-button
            >
            <el-button type="primary" icon="el-icon-search" @click="btnClick()"
            >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-circle-plus-outline" @click="btnAdd()" v-has="$g.add"
            >新增</el-button >
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="wenHuaList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" type="index" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="标题" width="180">
            <template slot-scope="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 1">上班卡</span>
              <span v-if="scope.row.type == 2">下班卡</span>
              <span v-if="scope.row.type == 3">全天</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="消息类型" width="180">
            <template slot-scope="scope"> 图片 </template>
          </el-table-column>
          <el-table-column align="center" prop="linkUrl" label="图片">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <el-image
                  slot="reference"
                  :src="
                  scope.row.materialDTO === null ? 'null' : scope.row.materialDTO.linkUrl
                "
                  class="imgStyle"
                  fit="contain"
                ></el-image>
                <el-image
                  class="bg_img"
                  :src="
                  scope.row.materialDTO === null ? 'null' : scope.row.materialDTO.linkUrl
                "
                  fit="contain"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开始时间">
            <template slot-scope="scope">
              {{ scope.row.startTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="推送结束时间">
            <template slot-scope="scope">
              {{ scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                size="small"
                v-has="$g.edit"
                @click="handleEditBtnClick(scope.row)"
              >编辑
              </el-button>
              <el-button
                type="text"
                v-has="$g.remove"
                icon="el-icon-delete"
                size="small"
                :disabled="scope.row.isDelete"
                @click="deleteBtn(scope.row.id)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <pagination
          v-show="modal.total > 0"
          :total="modal.total"
          :page.sync="queryForm.pageNum"
          :limit.sync="queryForm.pageSize"
          @pagination="initData"
        />
      </el-footer>
    </el-container>
    <UpdateDialog
      @sureModal="sureModal"
      @TextmaterialLoad="TextmaterialLoad"
      @photoLoad="photoLoad"
      ref="updDialog"
      :dialog="this.dialog"
    ></UpdateDialog>
    <Textmaterial ref="textmaterial" @getTextMaterial="getTextMaterial"></Textmaterial>
    <PhotoMaterial
      ref="photoMaterial"
      @getPhotoMaterial="getPhotoMaterial"
    ></PhotoMaterial>
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="25%" center>
      <span>确认删除吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>
<script>
import { getList, updateModal, addeModal, deleModal } from "@/api/culture";
import store from "@/store";
import Pagination from "@/components/Pagination";
import UpdateDialog from "./components/UpdateDialog";
import Textmaterial from "./components/TextMaterial";
import PhotoMaterial from "./components/PhotoMaterial";

let id = "";
export default {
  components: {
    Pagination,
    UpdateDialog,
    Textmaterial,
    PhotoMaterial,
  },
  data() {
    return {
      wenHuaList: [],
      listLoading: false,
      centerDialogVisible: false,
      modal: {
        total: 0,
      },
      dialog: {
        visible: false,
        title: "",
        modal: {},
        typeName: "",
      },

      queryForm: {
        corpId: 1,
        pageNum: 1,
        pageSize: 10,
        title: "",
        type: "",
      },
      typeList: [
        { name: "上班卡", value: "1" },
        { name: "下班卡", value: "2" },
        { name: "全天", value: "3" },
      ],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async handleEditBtnClick(data) {
      if (this.$refs.updDialog.$refs.modalForm) {
        this.$refs.updDialog.$refs.modalForm.clearValidate();
      }
      let typeModal = this.typeList.filter((t) => t.value == data.type)[0];
      this.dialog.modal = data;
      this.dialog.typeName = typeModal.name;
      var time = [];
      time.push(data.startTime);
      time.push(data.endTime);
      this.$refs.updDialog.showtime(time);
      this.dialog.visible = true;
    },
    btnClick() {
      this.queryForm.pageNum = 1;
      this.initData();
    },
    resetBtn() {
      this.queryForm.title = "";
      this.queryForm.pageNum = 1;
      this.queryForm.type = "";
      this.initData();
    },
    initData() {
      this.queryForm.corpId = store.getters.currentCorp.id;
      getList(this.queryForm).then((response) => {
        this.wenHuaList = response.list;
        this.modal = response;
      });
    },
    //选择文本素材
    TextmaterialLoad() {
      this.$refs.textmaterial.LoadDate(1);
    },
    //获取已选择的文本元素
    getTextMaterial(data) {
      this.dialog.modal.extraInfo = data.content;
    },
    //选择图片素材
    photoLoad() {
      this.$refs.photoMaterial.LoadDate(1);
    },
    getPhotoMaterial(data) {
      this.dialog.modal.materialId = data.id;
      this.dialog.modal.materialDTO.linkUrl = data.linkUrl;
    },
    //修改或新增
    sureModal(data) {
      var _this = this;
      if (data.id != null) {
        updateModal(data).then((response) => {
          _this.$message({
            message: "修改成功",
            type: "success",
          });
          this.dialog.visible = false;
          this.initData();
        });
      } else {
        // this.data.corpId= store.getters.currentCorp.id
        addeModal(data).then((response) => {
          _this.$message({
            message: "添加成功",
            type: "success",
          });
          this.dialog.visible = false;
          this.initData();
        });
      }
    },
    //添加
    btnAdd() {
      if (this.$refs.updDialog.$refs.modalForm) {
        this.$refs.updDialog.$refs.modalForm.clearValidate();
      }
      this.dialog.modal = {
        extraInfo: "",
        type: "",
        materialDTO: {
          linkUrl: "",
        },
      };
      this.dialog.typeName = "";
      this.$refs.updDialog.showtime([]);
      this.dialog.visible = true;
    },
    //删除
    deleteBtn(s_id) {
      this.centerDialogVisible = true;
      id = s_id;
    },
    sureBtn() {
      var ids = [];
      ids.push(id);
      var _this = this;
      deleModal(ids).then((response) => {
        _this.$message({
          message: "删除成功",
          type: "success",
        });
        this.centerDialogVisible = false;
        this.initData();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.imgStyle {
  height: 120px;
  width: 120px;
}

.bg_img {
  height: 300px;
  width: 300px;
}
</style>
