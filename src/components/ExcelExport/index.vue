<template>
  <el-button type="success" icon="el-icon-download" :loading="downloadLoading" @click="handleDataExportBtnClick">导出</el-button>
</template>

<script>
  export default {
    name: "ExcelExport",
    data () {
      return {
        downloadLoading: false
      }
    },
    props: {
      fileName: {
        type: String,
        default: "excel export"
      },
      exportData: {
        type: Array,
        default: () => {}
      },
      headNames: {
        type: Array,
        default: () => {}
      },
      columnNames: {
        type: Array,
        default: () => {}
      }
    },
    methods: {
      handleDataExportBtnClick() {
        if (this.checkParams()) {
          console.log("开始导出数据");
          this.downloadLoading = true
          const data = this.formatJson(this.exportData,this.columnNames)
          import('@/vendor/Export2Excel').then(excel => {
            excel.export_json_to_excel({
              header: this.headNames,
              data,
              filename: this.fileName
            })
            this.downloadLoading = false
          })
        }

      },
      formatJson(list,filterVal) {
        return list.map(v => filterVal.map(j => {
          if (_.isNull(v[j]) ) {
            return '';
          } else {
            return v[j];
          }
        }))
      },
      checkParams() {
        if (_.isNull(this.exportData)) {
          this.$message.error("导出数据为空")
          return false
        }
        if (this.headNames.length == 0 || this.columnNames.length == 0) {
          this.$message.error("导出文件标题或者列名为空")
          return false
        }

        if (this.headNames.length != this.columnNames.length) {
          this.$message.error("导出文件标题与列名数量不一致")
          return false
        }

        return true
      }
    }
  }
</script>

<style scoped>

</style>
