<template>
  <div ref="collapse">
    <el-collapse-transition>
      <div v-show="collapseShow" style="margin-left: 10px">
        <slot name="content"></slot>
      </div>
    </el-collapse-transition>
    <el-button icon="el-icon-arrow-down" @click="handleBtnClick(true)" type="text" style="margin-left: 50%; margin-top: 22px" v-if="!collapseShow">展开查询</el-button>
    <el-button icon="el-icon-arrow-up" @click="handleBtnClick(false)" type="text" style="margin-left: 50%; margin-top: 22px" v-else>折叠查询</el-button>
  </div>
</template>

<script>
  export default {
    name: "CollapseTransition",
    data () {
      return {
        collapseShow: true,
      }
    },
    methods: {
      handleBtnClick(row) {
        this.collapseShow = row
      }
    }
  }
</script>

<style scoped>

</style>
