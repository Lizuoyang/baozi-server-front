<template>
  <el-breadcrumb class="app-breadcrumb" separator="/" style="width: 88%">
    <el-tabs v-model="_.cloneDeep(activeTab)" @tab-click="handleTabsClick" ref="systemTabs">
      <el-tab-pane v-for="item in systemMenus" :key="item.id" :label="item.systemName"
                   :name="_.toString(item.id)"></el-tab-pane>
    </el-tabs>
  </el-breadcrumb>
</template>

<script>
  import {mapGetters} from "vuex";
  import store from "@/store";

  export default {
    name: "BreadcrumbMenu",
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters([
        'activeTab',
        'systemMenus',
        'corps',
        'currentCorp'
      ])
    },
    watch: {
      $route() {
        if (this.$route.meta.systemId) {
          this.$store.dispatch("menu/changeActiveTab", this.$route.meta.systemId[0])
        }
      }
    },
    async created() {
    },
    methods: {
      handleTabsClick(data) {
        this.$store.dispatch("menu/changeActiveTab", data.name)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
