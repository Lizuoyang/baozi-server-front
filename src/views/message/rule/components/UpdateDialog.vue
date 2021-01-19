<template>
  <el-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="30%" top="5vh">
    <el-form style="width: 400px" :model="dialog.rule" :rules="ruleFormRules" ref="ruleForm" label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="规则名称:" prop="serviceName">
        <el-input v-model="dialog.rule.serviceName" placeholder="请输入规则名称"></el-input>
      </el-form-item>

      <el-form-item label="规则类型:" prop="type">
        <el-radio-group v-model="dialog.rule.type" :disabled="dialog.rule.id">
          <el-radio-button label="1">群聊</el-radio-button>
          <el-radio-button label="2">多人</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="群聊名称:" prop="chatName">
        <el-input v-model="dialog.rule.chatName" :disabled="dialog.rule.type == 2" placeholder="请输入群聊名称"></el-input>
      </el-form-item>

      <el-form-item label="群聊成员:" prop="userIdList">
        <department-tree-select @input="handleTreeSelectInput" :value="memberTreeValue"></department-tree-select>
      </el-form-item>

      <el-form-item label="选择群主:" prop="owner" v-if="dialog.rule.type == 1 && !_.isEmpty(this.dialog.rule.userIdList)">
        <el-select v-model="dialog.rule.owner" style="width: 100%" placeholder="请选择群主">
          <el-option v-for="item in selectedUserList" :key="item.id" :label="item.label || item.name" :value="item.jobId"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submitUserForm" icon="el-icon-circle-check">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {mapGetters} from 'vuex'
  import DepartmentTreeSelect from '@/components/DepartmentTreeSelect'
  import {createRule,updateRule} from '@/api/message'

  export default {
    name: "UpdateDialog",
    data() {
      let validateChatName = (rule, value, callback) => {
        if (this.dialog.rule.type == 1 && _.isEmpty(value)) {
          callback(new Error('请输入群聊名称!'));
        } else {
          callback();
        }
      };
      let validateOwner = (rule, value, callback) => {
        if (this.dialog.rule.type == 1 && _.isEmpty(value)) {
          callback(new Error('请选择群主!'));
        } else {
          callback();
        }
      };
      return {
        ruleFormRules: {
          serviceName: [
            {required: true, message: '请输入规则名称', trigger: 'blur'},
          ],
          chatName: [
            {validator: validateChatName, trigger: ['blur']},
          ],
          userIdList: [
            {required: true, message: '请选择群聊成员', trigger: ['blur', 'change']},
          ],
          owner: [
            {validator: validateOwner, trigger: ['blur', 'change']},
          ],
        },
        memberTreeValue: null,
        selectedUserList: []
      }
    },
    components: {
      DepartmentTreeSelect
    },
    props: {
      dialog: {
        type: Object,
        default: null
      },
    },
    computed: {
      ...mapGetters([
        'currentCorp',
        'user'
      ])
    },
    methods: {
      handleTreeSelectInput(data){
        this.$set(this.dialog.rule, 'userIdList', data.map(x => x.jobId))
        this.$set(this, 'selectedUserList', data)
        let selectedJobIds = data.map(x => x.jobId)
        if (_.indexOf(selectedJobIds, this.dialog.rule.owner) == -1) {
          this.$set(this.dialog.rule, 'owner', null)
        }
      },
      async submitUserForm() {
        this.$refs['ruleForm'].validate(async valid => {
          if (valid) {
            let params = {
              id: this.dialog.rule.id,
              serviceName: this.dialog.rule.serviceName,
              type: this.dialog.rule.type,
              chatName: this.dialog.rule.chatName,
              chatId: this.dialog.rule.chatId,
              agentId: this.dialog.rule.agentId,
              owner: this.dialog.rule.owner,
              createdBy: this.user.loginName,
              userList: this.dialog.rule.userIdList,
              corpId: this.currentCorp.id
            }

            if (_.isEmpty(this.dialog.rule.id)) {
              await createRule(params)
            } else {
              params.updatedBy = this.user.loginName,
              await updateRule(params)
            }

            this.dialog.visible = false;
            this.$notify({
              type: 'success',
              title: this.dialog.title,
              position: 'top-right',
              message: '成功',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          } else {
            return false;
          }
        })

      }
    }
  }
</script>

<style scoped>

</style>
