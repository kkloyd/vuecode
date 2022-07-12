<template>
  <div v-if="tree && tree.length" class="columns">
    <el-dropdown
      :hide-on-click="false"
      placement="bottom-start"
    >
      <el-button type="default" :size="size">
        {{ name }}
        <i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown" class="columns-dropdown">
        <el-tree
          :data="tree"
          :show-checkbox="true"
          :check-on-click-node="true"
          :default-expand-all="false"
          :node-key="nodeKey"
          :default-checked-keys="defaultCheckedKeys"
          :props="defaultProps"
          empty-text=""
          @check="handleCheck"
        />
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {deepClone} from "@/lib/utils"

export default {
  name: "BaseVisibilityFilterMenu",
  props: {
    "name": {
      type: String,
      default: "Фильтр",
    },
    "size": {
      type: String,
      default: "medium",
    },
    "items": {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tree: [],
      nodeKey: "id",
      defaultProps: {
        label: "label",
      },
      defaultCheckedKeys: [],
    }
  },
  watch: {
    items: {
      handler: function (val) {
        let items = deepClone(val)
        this.tree = items.map(item => {
          return {
            id: item.id,
            label: item.name,
          }
        })
        this.defaultCheckedKeys = items.map(item => item.id)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleCheck(node, tree) {
      this.$emit("change", tree.checkedKeys)
    },
  },
}
</script>

<style lang="stylus" scoped>
.columns
  display block
  &-dropdown
    max-height 250px
    overflow-y auto
    padding-right 15px
    & >>> .el-tree-node__content
      height 20px
</style>
