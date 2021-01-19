<template>
  <el-dialog :title="title" :visible.sync="channelDilog" show-close width="40%" top="20vh">
    <el-form style="width: 450px" v-model="modal" ref="modalForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="渠道名称:">
        <el-input style="width:350px" v-model="modal.stateName" placeholder="请输入渠道名称" size="mini">
        </el-input>
      </el-form-item>
      <el-form-item label="选择标签:" prop="tagIds">
        <treeselect
          style="width: 350px"
          size="small"
          placeholder="请选择"
          noOptionsText="暂无数据"
          noChildrenText="暂无数据"
          :openOnFocus="true"
          :multiple="true"
          :defaultExpandLevel="0"
          @input="handleTagTreeSelectInput"
          :options="tagTreeOptions"
          :disable-branch-nodes="true"
          :value="tagTreeValue"
          valueFormat="node"
          search-nested
        />
      </el-form-item>
      <el-form-item label="渠道备注:">
        <el-input style="width:350px" v-model="modal.remark" placeholder="请输入备注" size="mini">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="channelDilog= false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submit" icon="el-icon-circle-check">确 定</el-button>
      </span>

  </el-dialog>


</template>
<script>
  import Treeselect from '@riophae/vue-treeselect'
  import {addState, updateState} from '@/api/develop'
  import store from '@/store'

  export default {
    name: 'Channelinfo',
    components: {
      Treeselect,
    },
    data() {
      return {
        channelDilog: false,
        modal: {
          stateName: '',
          tagsIds: [],
          remark: '',
        },
        tagTreeValue: null,
        tagTreeOptions: [],
        corpId: ''
      }
    },
    props: {
      'title': String,
    },
    created() {

    },
    methods: {
      handleTagTreeSelectInput(row) {
        this.tagTreeValue = row;
      },
      showDialog(data) {
        this.corpId = store.getters.currentCorp.id;
        this.channelDilog = true;
        if (data != null) {
          this.modal.stateName = data.stateName;
          this.modal.id = data.id;
          this.modal.remark = data.remark;
        } else {
          this.modal = {
            stateName: '',
            tagsIds: [],
            id: '',
            remark: '',
          };
          this.tagTreeValue = null;
        }
      },
      submit() {
        if (this.modal.stateName == '' || this.modal.stateName == undefined) {
          this.$message({message: '请输入渠道名称', showClose: true, type: 'error'})
          return;
        }
        if (this.tagTreeValue.length == 0) {
          this.$message({message: '请选择标签', showClose: true, type: 'error'})
          return;
        }
        this.modal.tagsIds = [];
        for (var i = 0; i < this.tagTreeValue.length; i++) {
          this.modal.tagsIds.push(this.tagTreeValue[i].tagId);
        }
        this.modal.corpId = this.corpId;
        var id = this.modal.id;
        if (this.modal.id == '' || this.modal.id == undefined) {
          this.modal.createdBy = store.getters.user.loginName;
          addState(this.modal).then(response => {
            this.$message({message: '添加成功', showClose: true, type: 'success'})
            this.$emit("LoadSatetList");
            this.channelDilog = false;
          })
        } else {
          this.modal.updatedBy = store.getters.user.loginName;
          updateState(this.modal).then(response => {
            this.$message({message: '修改成功', showClose: true, type: 'success'})
            this.$emit("LoadSatetList");
            this.channelDilog = false;
          })
        }


      }
    },
  }
</script>
