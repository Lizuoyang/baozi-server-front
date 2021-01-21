<template>
  <div class="iframe-container">
    <iframe :src="swaggerUrl" scrolling="auto" frameborder="0" class="frame">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: "Swagger",
    data () {
      return {
        swaggerUrl: process.env.VUE_APP_SWAGGER_ADMIN_API,
      }
    }
  }
</script>

<style scoped>

</style>
