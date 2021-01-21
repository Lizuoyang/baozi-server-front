<template>
  <div class="iframe-container">
    <iframe :src="druidUrl" scrolling="auto" frameborder="0" class="frame">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: "Druid",
    data () {
      return {
        druidUrl: process.env.VUE_APP_DRUID_ADMIN_API,
      }
    }
  }
</script>

<style scoped>

</style>
