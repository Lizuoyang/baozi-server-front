//客户详细
<template>
     <el-dialog title="客户详情" :visible.sync="showInfo" show-close width="40%" top="10vh" >
    <div class="el-dialog-div">
                <div>
                    <div class="box1">
                        <img :src="customer.avatar" style="width: 100px;height: 100px">
                    </div>
                    <div class="box2">
                        <div>
                            <span style="font-size: 3vh">{{customer.name}}</span>
                        </div>
                        <div style="margin-top: 8px">
                            <el-tag v-if="customer.type==1" size="mini">微信用户</el-tag>
                            <el-tag v-if="customer.type==2" size="mini">企业微信用户</el-tag>
                        </div>
                        <div style="margin-top: 10px" >
                            <span>会话标签：</span>
                            <span v-for="item in customer.tags"><el-tag style="margin-left: 5px" size="mini">{{item}}</el-tag></span> 
                        </div>
                    </div>
                </div>

                <div style="margin-top: 150px" >
                    <el-divider></el-divider>
                <div v-for="item in customer.userExternalContactDTOList"  style="margin-top: 50px;background-color: rgba(255,240,216,0.11)">
                    <span>添加人：{{item.userDTO.name}}</span><br><br>
                    <span>所在部门：{{item.userDTO.departmentName}}</span><br><br>
                    <span>添加时间：{{item.createtime}}</span><br><br>
                    <span>客户昵称：{{customer.name}}</span><br><br>
                    <span>备注名：{{item.remark}}</span><br><br>
                    <span>企业：{{item.remarkCorpName}}</span><br><br>
                    <span>电话号码：{{item.userDTO.cellphone}}</span><br><br>
                    <span>描述：{{item.description}}</span><br><br>
                   <span >客户标签：<span  v-for="tag in item.tags"><el-tag size="mini">{{tag}}</el-tag></span></span><br><br> 
                </div>

                </div>
            </div>

      </el-dialog>


</template>
<script>
  import { getInfo } from '@/api/customer'
  import store from '@/store'
     export default {
        name: "info",
      data() {
      return {
           showInfo:false,
           customer:{
             tags:[],
             userExternalContactDTOList:[],
           },
      }
    },
      props: {
        id:String,
      },
      methods: {
        showInfoDialog(id){
         let corpId=store.getters.currentCorp.id
        // console.log("==========="+this.id);
         let parem={
           corpId:corpId,
           id:id
         }
         getInfo(parem).then(response => {
             console.log(response);
             this.customer=response;
            this.showInfo=true;
          })
        }
      },

     }
</script>

<style lang="scss" scoped>

    .el-dialog-div {
        height: 60vh;
        width: 100%;
        overflow: auto;
    }

    .add-tag-member {
        display: flex;
    }
   .box1 {
        float: left;
        width: 110px;
        height: 110px;
    }
   .box2 {
        float: left;
        height: 110px;
    }
</style>