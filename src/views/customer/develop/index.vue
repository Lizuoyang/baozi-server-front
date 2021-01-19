<template>
  <el-card class="box-card">
    <el-container>
      <el-main>
        <el-tabs v-model="TabType" @tab-click="TabChange" tab-position="left">
          <el-tab-pane label="客户渠道码" name="0"  :lazy="true">
            <Channelcode ref="channelcode"/>
          </el-tab-pane>
          <el-tab-pane label="客户欢迎语" name="1"  :lazy="true">
            <WelcomeMessage ref="welcomeMessage"/>
          </el-tab-pane>
          <el-tab-pane label="渠道列表" name="2"  :lazy="true">
            <Channel ref="channel"/>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
  </el-card>
</template>

<script>
  import store from '@/store'
  import Channelcode from "./components/Channelcode"
  import WelcomeMessage from "./components/WelcomeMessage"
  import Channel from "./components/Channel"

  export default {
    components: {
      Channelcode,
      WelcomeMessage,
      Channel
    },
    data() {
      return {
        TabType: "0",
      }
    },

    created() {

    },
    methods: {
      //顶部标签切换
      TabChange(tab, event) {
        this.TabType = tab.name;
        // if(this.TabTyp=="0"){
        //   this.qrCodeList();
        // }else if(this.TabTyp=="1"){
        //   this.$refs.welcomeMessage.LoadDateDefault();
        // }

      },
      //客户渠道码
      qrCodeList() {
        this.$refs.channelcode.Loaddate();
      },


    },


  }


</script>


<style lang="scss">
  .el-tabs__nav-wrap::after {
    background-color: white;
  }

  .el-tabs__nav-wrap::after {
    background-color: white;
  }
</style>
<style lang="scss" scoped>


</style>
