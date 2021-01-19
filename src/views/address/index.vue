<template>
  <el-card class="box-card">
    <el-container>
      <el-main>
        <el-tabs :tab-position="tabPosition" style="width: calc(100%)" @tab-click="handleTabsChange" v-model="tabsValue">
          <el-tab-pane label="组织架构" name="org" :lazy="true">
            <organization-user ref="org"></organization-user>
          </el-tab-pane>
          <el-tab-pane label="标签" name="tag" :lazy="true">
            <tag-user ref="tag"></tag-user>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-card>
</template>

<script>
  import OrganizationUser from './components/OrganizationUser'
  import TagUser from './components/TagUser'

  export default {
    name: "Address",
    data() {
      return {
        tabPosition: "left",
        tabsValue: 'org'
      }
    },
    components: {
      OrganizationUser,
      TagUser
    },
    methods: {
      handleTabsChange() {
        console.log(this.tabsValue)
      }
    }
  }
</script>

<style scoped>

</style>
