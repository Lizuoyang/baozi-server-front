//欢迎语
<template>
  <div style="height:100%">
    <el-container>
      <el-header class="dashboard-head" style="height: 100px">
        <span class="title_1">默认欢迎语</span>
        <el-button v-if="defaultList.length==0" style="float:right;margin-bottom:5px" type="success"
                   icon="el-icon-circle-plus-outline" v-has="$g.add" @click="addWelocme(1)">添加默认欢迎语
        </el-button>
        <el-button style="float:right;margin-bottom:5px;margin-right:10px" type="success" icon="el-icon-circle-plus-outline"
                   v-has="$g.add" @click="addWelocme(0)">添加
        </el-button>
        <el-button style="float:right;margin-bottom:5px;margin-right:10px" icon="el-icon-delete" type="danger" size="small"
                   v-has="$g.remove" @click="delAll()">批量删除
        </el-button>

        <el-table
          v-loading="listLoading"
          :data="defaultList"
          style="margin-top:15px"
          element-loading-text="Loading"
          height="90"
          border
          fit
          highlight-current-row>
          <el-table-column align="center" label="欢迎语">
            <template slot-scope="scope">
              {{ scope.row.content }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="配置时间" width="200">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-edit" @click="btnInfo(scope.row)" v-has="$g.edit" type="text">
                编辑
              </el-button>
              <el-button icon="el-icon-delete" size="small" v-has="$g.remove"
                         @click="btnDelete(scope.row.id)" type="text">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-header>
      <el-main>
        <!-- 欢迎语 -->
        <el-table
          v-loading="listLoading"
          :data="list"
          style="margin-top:10px"
          element-loading-text="Loading"
          border
          fit
          @selection-change="handleSelectionChange"
          highlight-current-row>
          <el-table-column align="center" type="index" label="序号" width="60">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column align="center" label="使用范围" width="350">
            <template slot-scope="scope" v-if='scope.row.states!=null'>
              <el-tag style="margin:5px;" v-for="item in scope.row.states" :key="item!=null?item.id:0" v-if="item!=null"
                      effect="dark" size="mini"
                      color="#13C2C2">
                {{ item.stateName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="欢迎语">
            <template slot-scope="scope">
              <el-popover
                style="cursor: pointer"
                placement="top-start"
                width="400"
                trigger="hover"
                :content="scope.row.content">
                <span slot="reference">{{ _.truncate(scope.row.content)  }}</span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="配置时间" width="180">
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-edit" @click="btnInfo(scope.row)" type="text">
                编辑
              </el-button>
              <el-button icon="el-icon-delete" size="small"
                         @click="btnDelete(scope.row.id)" type="text">
                删除
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
          @pagination="LoadDates"
        />
      </el-footer>
    </el-container>

    <WelcomeInfo ref="WelcomeInfo"
                 :title="title"
                 :welcomeType="welcomeType"
                 @LoadDates="LoadDates"
                 @LoadDateDefault="LoadDateDefault"
                 @getTextBtn="getTextBtn"
                 @getBtnImage="getBtnImage"/>
    <Textmaterial ref="textmaterial"
                  @getTextMaterial="getTextMaterial"></Textmaterial>
    <PhotoMaterial ref="photoMaterial"
                   @getPhotoMaterial="getPhotoMaterial"></PhotoMaterial>
  </div>
</template>
<script>
  import {getWelcomeList, getDefaultWelcome, deleWelcome} from '@/api/develop'
  import Pagination from "@/components/Pagination";
  import WelcomeInfo from "./WelcomeInfo"
  import Textmaterial from "../../../culture/corporate/components/TextMaterial"
  import PhotoMaterial from "../../../culture/corporate/components/PhotoMaterial"
  import store from '@/store'

  export default {
    name: 'WelcomeMessage',
    components: {
      Pagination,
      WelcomeInfo,
      Textmaterial,
      PhotoMaterial
    },
    data() {
      return {
        listLoading: false,
        title: '添加',
        imageSrc: '',
        fileKey: '',
        ids: [],
        content_text: '',
        defaultList: [],
        list: [],
        welcomeType: 0,
        queryForm: {
          corpId: store.getters.currentCorp.id,
          pageSize: 10,
          pageNum: 1,
        },
        modal: {
          total: 0
        },
      }
    },
    created() {
      this.LoadDateDefault();
      this.LoadDates();
    },
    methods: {
      LoadDateDefault() {
        let parme = {
          corpId: store.getters.currentCorp.id
        }
        getDefaultWelcome(parme).then(response => {
          this.defaultList = [];
          if (response != '' && response != undefined) {
            this.defaultList.push(response);
          }
        })
      },
      //获取欢迎语列表
      LoadDates() {
        this.listLoading = true;
        getWelcomeList(this.queryForm).then(response => {
          console.log(response);
          this.list = response.list;
          this.modal = response;
          this.listLoading = false;
        })
      },
      handleSelectionChange(val) {
        this.ids = val.map(x => x.id)
      },
      delAll() {
        if (this.ids.length > 0) {
          this.sureDelete(this.ids);
        } else {
          this.$message({message: '请选择你要删除的内容,', showClose: true, type: 'error'})
        }
      },
      btnDelete(id) {
        var ids = [];
        ids.push(id);
        this.sureDelete(ids);
      },

      btnInfo(data) {
        this.title = '编辑';
        this.welcomeType = data.isDefault;
        console.log(data);
        this.$refs.WelcomeInfo.showDialog(data)
      },
      sureDelete(ids) {
        this.$confirm('是否删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleWelcome(ids).then(response => {
            this.$message({message: '删除成功', showClose: true, type: 'success'})
            this.LoadDateDefault();
            this.LoadDates();
          })
        }).catch(() => {

        });
      },
      addWelocme(type) {
        this.title = '添加'
        this.welcomeType = type;
        this.$refs.WelcomeInfo.showDialog()
      },
      //获取已选择的文本元素
      getTextMaterial(data) {
        this.$refs.WelcomeInfo.getTextDate(data.content)
      },
      getPhotoMaterial(data) {
        // this.dialog.modal.materialId = data.id;
        this.$refs.WelcomeInfo.getPic(data)
      },

      getTextBtn() {
        this.$refs.textmaterial.LoadDate(1);
      },
      getBtnImage() {
        this.$refs.photoMaterial.LoadDate(1);
      }

    },
  }
</script>


<style lang="scss" scoped>
  .title_1 {
    color: black;
    font-size: 16px;
    margin-left: 10px;
    font-weight: bold;
  }

  .el-tag--dark {
    border-color: #13C2C2;
  }

  .imgStyle {
    height: 80px;
    width: 80px;
  }
</style>
