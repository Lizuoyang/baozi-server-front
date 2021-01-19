<template>
  <div>
    <treeselect
      size="small"
      placeholder="请选择"
      noOptionsText="暂无数据"
      noChildrenText="暂无数据"
      :openOnFocus="true"
      :multiple="multiple"
      :defaultExpandLevel="0"
      @input="handleTreeSelectInput"
      :options="memberTreeOptions"
      :load-options="loadOptions"
      :auto-load-root-options="true"
      :disable-branch-nodes="disableBranchNodes"
      :value="memberTreeValue"
      valueFormat="node"
      search-nested
    />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {LOAD_ROOT_OPTIONS, LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
  import {getDepartSub} from '@/api/department'
  import {departmentToTree, memberToTree} from "@/utils/treeSelect";

  export default {
    name: "DepartmentTreeSelect",
    data() {
      return {
        memberTreeOptions: null,
      }
    },
    components: {
      Treeselect,
    },
    computed: {
      ...mapGetters([
        'currentCorp'
      ]),
      memberTreeValue: {
        get() {
          return _.cloneDeep(this.value)
        },
        set(v) {
          return v
        }

      }
    },
    props: {
      value: {
        type: Array,
        default: () => {
        }
      },
      multiple: {
        type: Boolean,
        default: true
      },
      disableBranchNodes: {
        type: Boolean,
        default: true
      },
    },
    methods: {
      handleTreeSelectInput(value, instanceId) {
        this.$emit("input", value)
      },
      async loadOptions({action, parentNode, callback}) {
        if (action === LOAD_ROOT_OPTIONS) {
          const {departs} = await getDepartSub({
            departmentId: "1",
            corpId: this.currentCorp.id
          })
          this.memberTreeOptions = _.map(departs, departmentToTree)
          callback()
        }
        if (action === LOAD_CHILDREN_OPTIONS) {
          const {departs, members} = await getDepartSub({departmentId: parentNode.id, corpId: this.currentCorp.id})
          this.$set(parentNode, 'children', _.map(departs, departmentToTree))
          parentNode.children = _.map(members, memberToTree).concat(_.map(departs, departmentToTree))
          callback()
        }
      },
    }
  }
</script>

<style scoped>

</style>
