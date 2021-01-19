//图片元素选择模板
<template>
    <el-dialog title="选择素材" :visible.sync="visible" show-close width="50%" top="20vh">
      <div style="max-height: 400px; overflow: auto;">
        <el-row>
          <el-col :span="6" v-for="(item, index) in sourceList" :key="index">
            <el-card class="card-item" @click.native="selectCard(item)">
               <el-image :src="item.linkUrl" class="image" />
              <div class="title">{{item.title}}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
      <div  style="margin-top: 10px;" v-if="photoModal.total>20">
   <el-pagination
      @current-change="handleSizeChange"
      :current-page="parme.page"
      :page-size="photoModal.pageSize"
      layout="total, prev, pager, next"
      :total="photoModal.total">
    </el-pagination>
   </div>
 </el-dialog>
</template>       

<script>
  import { getTextList } from '@/api/material'
  import store from '@/store'
  export default {
     name: "PhotoMaterial",
    data() {
      return {
        visible:false,
        sourceList:[],
        photoModal:{},
        parme:{
          page:1,
          limit:20,
          type:'image',
        } 
      }
    },
    methods: {
     selectCard(data) {
        this.$emit("getPhotoMaterial",data)
        this.visible=false;
       },
     LoadDate(page){
       this.parme.page=page;
       if(page==1){
         this.visible=true;
       }
       this.parme.corpId=store.getters.currentCorp.id;
        getTextList(this.parme).then(res => {
          console.log(res.data);
          this.photoModal=res.data
          this.sourceList = res.data.list;
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
  .card-item .image {
    display: block;
    height: 150px;
    width: 150px;
    overflow: hidden;
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
