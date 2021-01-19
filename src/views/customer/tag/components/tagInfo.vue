//客户详细
<template>
  <el-dialog title="客户详情" :visible.sync="showInfo" show-close width="40%" top="10vh">
    <div class="el-dialog-div">
      <el-form :model="addTagForm" status-icon label-width="100px" class="demo-ruleForm">
        <div id="tagGroup">
          <div>标签组名称</div>
          <el-input type="text" style="padding-top: 10px" v-model="addTagForm.tagGroupName" autocomplete="off"
                    size="mini"></el-input>
        </div>
        <div id="tag" style="padding-top: 10px">
          <div>标签</div>
          <div v-for="(item, index) in dynamicItem" :key="index">
                            <span>
                                <el-input v-model="addTagForm.dynamicTags[index]" size='mini'
                                          style="width: 430px"></el-input>
                                <el-input v-model="addTagForm.tagIds[index]" type="hidden"
                                          style="width: 0px"></el-input>
                                <i class="el-icon-delete" @click="deleteItem(item, index)"
                                   style="padding-left: 30px;padding-top: 20px"></i>
                            </span>
          </div>
          <a @click="addItem" type="primary" style="display: inline-block;padding-top: 10px;font-size: small">+ 添加标签</a>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showInfo = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submit" icon="el-icon-circle-check">确 定</el-button>
    </span>
  </el-dialog>

</template>
<script>
  export default {
    data() {
      return {
        showInfo: false,
        addTagForm: {
          dynamicTags: [],
          tagIds: []
        },
        dynamicItem: []
      }
    },
    methods: {
      showInfobtn(val) {
       this.dynamicItem=new Array;
        if(val!=null){
        this.addTagForm.tagGroupName = val.groupName
        this.addTagForm.id = val.id
        for (let i = 0; i < val.ecTagList.length; i++) {
          this.dynamicItem.push({})
          this.addTagForm.dynamicTags.push(val.ecTagList[i].tagName)
          this.addTagForm.tagIds.push(val.ecTagList[i].tagId)
        }
        }else{
         this.addTagForm={
           dynamicTags: [],
           tagIds: []
         }
        }
        this.showInfo = true
      },
      close(){
        this.dynamicItem=new Array;
        this.showInfo=false;
      },
      addItem() {
        this.dynamicItem.push({})
        this.addTagForm.tagIds.push('')
      },
      //删除按钮
      deleteItem(item, index) {
        this.dynamicItem.splice(index, 1)
        this.addTagForm.dynamicTags.splice(index, 1)
        this.addTagForm.tagIds.splice(index, 1)
      },
      submit() {
        if (this.addTagForm.tagGroupName == '' || this.addTagForm.tagGroupName == undefined) {
          this.$message({
            message: '请设置标签组织名',
            type: 'warning'
          })
          return
        }
        if (this.addTagForm.dynamicTags == '') {
          this.$message({
            message: '请添加标签名',
            type: 'warning'
          })
          return
        }
        this.$emit('submit', this.addTagForm)

      }
    }
  }
</script>
