<template>
  <div>
    <el-container>
      <collapse-transition>
      <el-header class="dashboard-head" slot="content">
        <el-form :inline="true"  :model="queryForm" class="demo-form-inline">
          <el-form-item label="渠道名称:">
            <el-input v-model="queryForm.state" clearable placeholder="请输入渠道名称" @clear="Loaddate"></el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select
              v-model="queryForm.type"
              placeholder="类型"
              clearable
              filterable
              @clear="Loaddate"
            >
              <el-option
                v-for="type in typeList"
                :key="type.value"
                :label="type.name"
                :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="timeLimit"
              style="width:280px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="使用成员">
            <DepartmentTreeSelect style="width:280px" @input="handleTreeSelectInput" :value="memberTreeValue"/>
          </el-form-item>
          <el-form-item>
            <el-button type="info" icon="el-icon-refresh-right" @click="resetBtn()">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="Loaddate()">查询</el-button>
            <el-button  type="success" icon="el-icon-circle-plus-outline" @click="addCode()" v-has="$g.add">添加</el-button>
            <el-button  icon="el-icon-delete" type="danger" @click="delAllCode()" v-has="$g.remove">批量删除
            </el-button>
            <el-button  type="success" icon="el-icon-download" @click="exportDate()">导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      </collapse-transition>
      <el-main>
        <el-table
          v-loading="listLoading"
          :data="list"
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
          <el-table-column align="center" prop="qrCodeUrl" label="样式" width="100">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <el-image
                  slot="reference"
                  :src="
                  scope.row.qrCodeUrl === null ? 'null' : scope.row.qrCodeUrl
                "
                  class="imgStyle"
                  fit="contain"
                ></el-image>
                <el-image
                  class="bg_img"
                  :src="
                  scope.row.qrCodeUrl === null ? 'null' : scope.row.qrCodeUrl
                "
                  fit="contain"
                />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="使用成员" width="200">
            <template slot-scope="scope">
              <el-tag style="margin:5px;" v-for="item in scope.row.users" v-if="item != null" :key="item.jobId"
                      effect="dark" size="mini"
                      color="#13C2C2">
                {{ item.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="类型" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">单人</span>
              <span v-if="scope.row.type==2">多人</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="拉新数量" width="150">
            <template slot-scope="scope">
              {{ scope.row.count }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="渠道">
            <template slot-scope="scope" v-if="scope.row.stateDTO!=null">
              {{ scope.row.stateDTO.stateName}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="创建时间" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.createdTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width='238'>
            <template slot-scope="scope">
              <el-button  size="small" icon="el-icon-edit" v-has="$g.edit" @click="btnInfo(scope.row)" type="text">
                编辑
              </el-button>
              <el-button  size="small" icon="el-icon-download"
                          @click="btnDownload(scope.row.qrCodeUrl,scope.row.id)" type="text">
                下载
              </el-button>
              <el-button class="copyData"  size="small" :data-clipboard-text="scope.row.qrCodeUrl"
                         icon="el-icon-document-copy" @click="btnCopy(scope.row.qrCodeUrl)" type="text">
                复制
              </el-button>
              <el-button icon="el-icon-delete"  size="small"  v-has="$g.remove"
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
          @pagination="Loaddate"
        />
      </el-footer>
    </el-container>
    <ChannelcodeInfo :title='title'  ref="channelcodeInfo" @Loaddate="Loaddate"/>

  </div>
</template>
<script>
  import { getQrList,deleteQrCode,fetchExport} from '@/api/develop'
  import  develop from '../../../../api/develop.js'
  import $ from 'jquery'
  import store from '@/store'
  import  ChannelcodeInfo from './ChannelcodeInfo'
  import Clipboard from 'clipboard'
  import Pagination from '@/components/Pagination'
  import CollapseTransition from '@/components/CollapseTransition'
  import DepartmentTreeSelect from '@/components/DepartmentTreeSelect'

  export default {
    name: 'Channelcode',
    components: {
      Pagination,
      DepartmentTreeSelect,
      ChannelcodeInfo,
      CollapseTransition
    },
    data() {
      return {
        list: [],
        listLoading: false,
        title:'新增',
        ids:[],
        queryForm: {
          state: '',
          corpId: '',
          pageSize: 10,
          pageNum: 1,
          type: '',
          userIds: Array
        },
        typeList: [{
          name: '单人',
          value: '1'
        },
          {
            name: '多人',
            value: '2'
          }
        ],
        timeLimit: [],
        modal: {
          total: 0
        },
        memberTreeValue: []
      }
    },
    created() {
      this.queryForm.corpId = store.getters.currentCorp.id
      this.Loaddate()
    },
    methods: {
      handleSelectionChange(val) {
       this.ids=val.map(x => x.id)
      },
      delAllCode(){
        if(this.ids.length>0){
           this.sureDelete(this.ids);
        }else{
          this.$message({ message: '请选择你要删除的内容,', showClose: true, type: 'error' })
        }
      },
      Loaddate() {
        this.listLoading = true
        if (this.timeLimit != null && this.timeLimit.length == 2) {
          this.queryForm.startTime = this.timeLimit[0]
          this.queryForm.endTime = this.timeLimit[1]
        } else {
          this.queryForm.startTime = ''
          this.queryForm.endTime = ''
        }
        getQrList(this.queryForm).then(response => {
          this.modal = response
          this.list = response.list
          this.listLoading = false
        })
      },
      handleTreeSelectInput(data) {
        this.queryForm.userIds = []
        for (var i = 0; i < data.length; i++) {
          this.queryForm.userIds.push(data[i].jobId)
        }
        if (data.length == 0) {
          this.queryForm.userIds = Array
        }
      },
      btnDelete(id){
        var ids=[];
        ids.push(id);
        this.sureDelete(ids);
      },
      sureDelete(ids) {
         this.$confirm('是否删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteQrCode(ids).then(response => {
                  this.$message({ message: '删除成功', showClose: true, type: 'success' })
                  this.Loaddate();
               })
        }).catch(() => {

        });
      },
      btnInfo(data) {
        this.title='编辑'
         this.$refs.channelcodeInfo.showDialog(data)
      },
      //添加
      addCode() {
           this.title='添加'
           this.$refs.channelcodeInfo.showDialog()
      },
      resetBtn() {
        this.queryForm = {
          state: '',
          corpId: '',
          pageSize: 10,
          pageNum: 1,
          type: '',
          userIds: Array
        }
        this.timeLimit = new Array
      },
      btnDownload(imgsrc, name) {
        var image = new Image()
        // 解决跨域 Canvas 污染问题
        image.setAttribute('crossOrigin', 'anonymous')
        image.onload = function() {
          var canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          var context = canvas.getContext('2d')
          context.drawImage(image, 0, 0, image.width, image.height)
          var url = canvas.toDataURL('image/png') //得到图片的base64编码数据
          var a = document.createElement('a') // 生成一个a元素
          var event = new MouseEvent('click') // 创建一个单击事件
          a.download = name || 'photo' // 设置图片名称
          a.href = url // 将生成的URL设置为a.href属性
          a.dispatchEvent(event) // 触发a的单击事件
        }
        image.src = imgsrc
      },
      btnCopy(url) {
        let clipboard = new Clipboard('.copyData', {
          text: function() {
            return url
          }
        })
        clipboard.on('success', e => {
          this.$message({ message: '复制成功', showClose: true, type: 'success' })
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$message({ message: '复制失败,', showClose: true, type: 'error' })
          clipboard.destroy()
        })

      },
      //数据导出
      exportDate(){
        if (this.timeLimit != null && this.timeLimit.length == 2) {
          this.queryForm.startTime = this.timeLimit[0]
          this.queryForm.endTime = this.timeLimit[1]
        } else {
          this.queryForm.startTime = ''
          this.queryForm.endTime = ''
        }
        if(this.queryForm.userIds.length == 0){
          this.queryForm.userIds=new Array;
        }
        var url=develop.URL;
         window.open(url+"?"+$.param(this.queryForm))
      }

    }

  }
</script>

<style lang="scss">
  .vue-treeselect--has-value .vue-treeselect__multi-value {
    margin-bottom: 5px;
  }

  .el-form-item--small .el-form-item__content {
    line-height: 20px;
  }

  .vue-treeselect__multi-value-item {
    font-size: 10px;
    background-color: Gainsboro;
    color: #1890ff;
  }
</style>
<style lang="scss" scoped>
  .el-tag--dark {
    border-color: #13C2C2;
  }

  .bg_img {
    height: 150px;
    width: 150px;
  }

  .imgStyle {
    height: 80px;
    width: 80px;
  }
</style>
