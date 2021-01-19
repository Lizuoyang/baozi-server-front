//渠道码详细
<template>
  <el-dialog :title="title" :visible.sync="codeDilog" show-close width="40%" top="20vh">
    <el-form style="width: 450px" v-model="modal" ref="modalForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="类型:">
        <el-select v-model="value" placeholder="选择类型" @change="getType(value)">
          <el-option v-for="type in typeList" :key="type.value" :label="type.name"
                     :value="type.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="添加渠道:">
        <el-select filterable placeholder="请选择" v-model="modal.stateId">
          <el-option v-for="item in ChannelList" :label="item.stateName" :value="item.stateId" :key="item.stateId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用人员:">
        <DepartmentTreeSelect style="width:350px" :memberTreeOptions="treeNames" @input="handleTreeSelectInput"
                              :value="memberTreeValue">
        </DepartmentTreeSelect>
      </el-form-item>
      <el-form-item label="添加设置:">
        <el-checkbox v-model="checked">客户添加时无需确认自动添加为好友
        </el-checkbox>
      </el-form-item>
      <el-form-item label="备注:" prop="modal.remark">
        <el-input v-model="modal.remark" placeholder="请输入备注信息"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="codeDilog= false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submit" icon="el-icon-circle-check">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
  import DepartmentTreeSelect from '@/components/DepartmentTreeSelect'
  import {getStateList, addQrCode, updateQrCode} from '@/api/develop'
  import {memberToTree} from "@/utils/treeSelect";
  import store from '@/store'

  export default {
    name: 'ChannelcodeInfo',
    components: {
      DepartmentTreeSelect,
    },
    data() {
      return {
        codeDilog: false,
        ChannelList: [],
        checked: false,
        modal: {
          stateId: '',
          corpId: store.getters.currentCorp.id,
          createdBy: store.getters.user.loginName,
        },
        value: '1',
        typeList: [{
          name: '单人',
          value: '1'
        },
          {
            name: '多人',
            value: '2'
          }
        ],
        memberTreeValue: [],
        treeNames: [],
      }
    },
    props: {
      'title': String,
    },
    created() {

    },
    methods: {
      getType(value) {
        this.modal.type = value;
      },
      handleTreeSelectInput(data) {
        this.modal.userIds = []
        var a = this.memberTreeValue;
        for (var i = 0; i < data.length; i++) {
          this.modal.userIds.push(data[i].jobId)
        }
      },
      showDialog(entity) {
        this.getState();
        this.memberTreeValue = [];
        if (entity == undefined) {
          this.modal = {
            type: "",
            stateId: '',
            corpId: store.getters.currentCorp.id,
            createdBy: store.getters.user.loginName,
            userIds: []
          }
        } else {
          this.modal.userIds = [];
          for (var i = 0; i < entity.users.length; i++) {
            this.modal.userIds.push(entity.users[i].jobId)
          }
          if (entity.skipVerify == 1) {
            this.checked = true;
          }
          this.memberTreeValue = _.map(entity.users, memberToTree)
          this.modal.corpId = entity.corpId;
          this.modal.id = entity.id;
          this.modal.updatedBy = store.getters.user.loginName;
          this.value = entity.type + "";
          this.modal.type = entity.type + "";
          this.modal.stateId = entity.stateId;
        }
        this.codeDilog = true;
      },
      //获取渠道列表
      getState() {
        let parme = {
          corpId: store.getters.currentCorp.id,
          pageSize: 1000,
          pageNum: 1,
        }
        getStateList(parme).then(response => {
          console.log(response);
          this.ChannelList = response.list;
        })
      },
      submit() {
        console.log(this.modal);
        if (this.checked) {
          this.modal.skipVerify = 1;
        } else {
          this.modal.skipVerify = 0;
        }
        if (this.modal.stateId === '' || this.modal.stateId == undefined) {
          this.$message({message: '请选择渠道', showClose: true, type: 'error'})
          return;
        }
        if (this.modal.userIds.length == 0) {
          this.$message({message: '请选择使用人员', showClose: true, type: 'error'})
          return;
        }
        if (this.modal.id == undefined || this.modal.id == null) {
          addQrCode(this.modal).then(response => {
            this.$message({message: '添加成功', showClose: true, type: 'success'})
            this.codeDilog = false;
            this.$emit("Loaddate");
          })
        } else {
          updateQrCode(this.modal).then(response => {
            this.$message({message: '编辑成功', showClose: true, type: 'success'})
            this.codeDilog = false;
            this.$emit("Loaddate");
          })
        }


      }
    },
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
