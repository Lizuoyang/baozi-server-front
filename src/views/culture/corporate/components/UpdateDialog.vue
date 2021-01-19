<template>
  <el-dialog v-el-drag-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="35%" top="5vh">
    <el-form style="width: 450px" :model="dialog.modal" ref="modalForm" label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="dialog.modal.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="类型" prop="type">
       <el-select v-model="dialog.typeName" placeholder="选择类型"  @change="getType">
            <el-option v-for="type in typeList" :key="type.value" :label="type.name"
                       :value="type.value" ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="图片素材:" >
       <el-image  :src="dialog.modal.materialDTO==null?'':dialog.modal.materialDTO.linkUrl" class="imgStyle" fit="contain"></el-image>
      <el-button class="btn_select" type="primary" @click="selectPhoto" icon="el-icon-s-grid">选择图片素材</el-button>
      </el-form-item>
      <el-form-item label="文本素材:">
     <el-input
       type="textarea"
       :autosize="{ minRows:3, maxRows:5}"
       placeholder="请选择文本素材"
       :disabled="true"
      v-model="dialog.modal.extraInfo">
     </el-input>
        <el-button class="btn_select" type="primary" @click="addSource" icon="el-icon-s-grid">请选择文本素材</el-button>
      </el-form-item>
      <el-form-item label="选择时间段:">
             <el-date-picker
              style="width:350px"
              :picker-options="pickerOptions"
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss">
    </el-date-picker>
         </el-form-item>
        <el-form-item label="文章地址:">
             <el-input v-model="dialog.modal.linkUrl" placeholder="请输文章地址"></el-input>
         </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submit" icon="el-icon-circle-check">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

  export default {
     name: "UpdateDialog",
    data() {
      return {
        modalForm: {},
        time:[],
        typeList:[
                    { name: '上班卡', value: '1' },
                    { name: '下班卡', value: '2' },
                    { name: '全天', value: '3' }
                ],
       pickerOptions: {
            onPick() {

            }
      }
      }
    },
    props: {
      dialog: {
        type: Object,
        default: null
      },
    },
    created() {

    },
    methods: {
     submit(){
          if(  this.dialog.modal.title==null || this.dialog.modal.title=='' ){
        this.$message({
          message: '请输入标题',
          type: 'warning'
        });
        return;
       }
      if( this.dialog.modal.type==undefined || this.dialog.modal.type=='' ){
        this.$message({
          message: '请选择类型',
          type: 'warning'
        });
        return;
       }
       if( this.dialog.modal.materialId==undefined || this.dialog.modal.materialId=='' ){
        this.$message({
          message: '请选择图片素材',
          type: 'warning'
        });
        return;
       }
           if( this.dialog.modal.extraInfo==undefined || this.dialog.modal.extraInfo=='' ){
        this.$message({
          message: '请选择文本素材',
          type: 'warning'
        });
        return;
       }
       if(this.time.length==0){
        this.$message({
          message: '请选择时间',
          type: 'warning'
        });
        return;
       }
      this.dialog.modal.startTime=this.time[0];
      this.dialog.modal.endTime=this.time[1];
     this.$emit('sureModal',this.dialog.modal)
     },
     getType(type){
       this.dialog.modal.type=type;
         this.dialog.typeName=this.typeList.filter( t=> t.value==type)[0].name;
     },
     //选择文本
     addSource(){
          this.$emit('TextmaterialLoad');
      },
      selectPhoto(){
        this.$emit('photoLoad')
      },
      showtime(time){
       this.time=time;
      }
    }
    }



</script>

<style scoped>
.btn_select{
  margin-top:20px;
}
.imgStyle{
  height:100px;
  width:100px;
}
</style>
