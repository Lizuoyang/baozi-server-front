//文本元素选择模板
<template>
    <el-dialog title="选择素材" :visible.sync="Textvisible" show-close width="50%" top="20vh">
      <div style="max-height: 400px; overflow: auto;">
        <el-row>
          <el-col :span="6" v-for="(item, index) in sourceList" :key="index">
            <el-card class="card-item" @click.native="selectCard(item)"
                     :class="{ 'active-card': currentSource.id==item.id }">
              <p class="one">{{item.content}}</p>
              <div class="title">{{item.title}}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
  <div  style="margin-top: 10px;" v-if="TextModal.total>20">
   <el-pagination
      @current-change="handleSizeChange"
      :current-page="parme.page"
      :page-size="TextModal.pageSize"
      layout="total, prev, pager, next"
      :total="TextModal.total">
    </el-pagination>
   </div>
 </el-dialog>
</template>
<script>
  import { getTextList } from '@/api/material'
  export default {
     name: "TextMaterial",
    data() {
      return {
        Textvisible:false,
        currentSource:{},
        sourceList:[],
        TextModal:{},
        parme:{
          page:1,
          limit:20,
          type:'text',
        } 
      }
    },
    methods: {
     selectCard(data) {
       this.currentSource = data
        this.$emit("getTextMaterial",this.currentSource)
         this.Textvisible=false;
       },
     LoadDate(page){
       this.parme.page=page;
       if(page==1){
         this.Textvisible=true;
       }
        getTextList(this.parme).then(res => {
          console.log(res.data);
          this.sourceList = res.data.list;
          this.TextModal=res.data;
        })
     },
     handleSizeChange(val) {
         this.LoadDate(val);
      }  

    }
    }


</script>  
<style scoped>
  .card-item {
    text-align: center;
    margin-bottom: 5px;
    height: 200px;
  }
    .card-item .one {
    display: block;
    height: 150px;
    /*width: 150px;*/
    overflow: auto;
    margin: 0 auto 10px;
  }

  .card-item .title {
    text-align: center;
    font-size: 12px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  .card-item:active{
      background:#E4E7ED;
  }
   .card-item:hover{
cursor:pointer
}
</style>