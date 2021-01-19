<template>
  <ele-import
    :dialogWidth="dialogWidth"
    :fields="fields"
    :filepath="filepath"
    :append="append"
    :formatter="formatter"
    :requestFn="requestFn"
    :rules="rules"
    :tips="tips"
    :title="title"
    :visible="visible"
    @close="closeFn"
    @finish="handleFinishImport"
  />
</template>

<script>
  // excel 导入
  import EleImport from 'vue-ele-import'
  export default {
    name: "ExcelImport",
    data(){
      return{

      }
    },
    components: {
      EleImport
    },
    props: {
      // 文件路径
      filepath: {
        type: String,
        required: true
      },
      // 请求方法
      requestFn: {
        type: Function,
        required: true
      },
      // 关闭弹窗方法
      closeFn: {
        type: Function,
        required: true
      },
      // 字段
      fields: {
        type: Object,
        required: true
      },
      // 是否显示弹窗
      visible: {
        type: Boolean,
        required: true
      },
      // 弹窗标题
      title: {
        type: String,
        default: '批量导入'
      },
      // 提示信息，数组
      tips: Array,
      // 增加附加数据
      append: Object,
      // 验证规则
      rules: Object,
      // 格式化数据
      formatter: {
        type: Object
      },
      // 弹窗宽度
      dialogWidth: {
        type: String,
        default: '70%'
      }
    },
    methods: {
      handleFinishImport() {
        console.log('导入完毕了~')
      },
    }
  }
</script>

<style scoped>

</style>
