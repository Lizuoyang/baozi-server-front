<template>
  <el-dialog :title="dialog.title" :visible.sync="dialog.visible" show-close width="35%" top="5vh">
    <el-form :model="dialog.reward" :rules="rewardRules" ref="rewardRuleForm" label-width="100px"
             class="demo-ruleForm" :inline="false">
      <el-form-item label="派发方案:" prop="selectedCoupon">
        <el-select v-model="dialog.reward.assignId" filterable clearable style="width: 84%" @change="handleCouponSelectChange">
          <el-option v-for="item in dialog.coupons" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发放数量:">
        <el-input v-model="dialog.reward.prizeTotal" :disabled="true" style="width: 84%"></el-input>
      </el-form-item>

      <el-form-item label="兑换次数:">
        <el-input v-model="dialog.reward.limitNum" :disabled="true" style="width: 84%"></el-input>
      </el-form-item>

      <el-form-item label="兑换图片:" prop="prizeLink">
        <file-upload @success="handlePrizeLinkUploadSuccess" :defaultImage="{linkUrl: dialog.reward.prizeLink}" :file-type="['jpg','png','jpeg']"></file-upload>
      </el-form-item>

      <el-form-item label="兑换说明:">
        <el-input
          autosize
          type="textarea"
          style="width:84%"
          v-model="dialog.reward.prizeDesc"
          placeholder="请输入兑换说明">
        </el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialog.visible = false" icon="el-icon-error">取 消</el-button>
      <el-button type="primary" @click="submitForm" icon="el-icon-circle-check">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import FileUpload from '@/components/FileUpload'
  import {updateActivityCoupon} from '@/api/task-activity'
  export default {
    name: "RewardDialog",
    data () {
      return {
        rewardRules: {},
        selectedCoupon: null
      }
    },
    components: {
      FileUpload
    },
    props: {
      dialog: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      submitForm() {
        console.log(this.dialog.reward)
        updateActivityCoupon(this.dialog.reward).then(res => {
          if (res) {
            this.dialog.visible = false
            this.$notify({
              type: 'success',
              title: this.dialog.title,
              position: 'top-right',
              message: '操作成功',
              showClose: false,
              offset: 50,
              duration: 1000
            })
          }
        })
      },
      handlePrizeLinkUploadSuccess(file) {
        this.$set(this.dialog.reward, 'prizeLink', file.accessUrl)
      },
      async handleCouponSelectChange(data) {
        let findCoupon = _.find(this.dialog.coupons, {id: data})
        this.$set(this.dialog.reward, 'limitNum', _.isNull(findCoupon.exchangeCount) ? 0 : findCoupon.exchangeCount)
        this.$set(this.dialog.reward, 'prizeTotal', _.isNull(findCoupon.count) ? 0 : findCoupon.count)
      }
    }
  }
</script>

<style scoped>

</style>
