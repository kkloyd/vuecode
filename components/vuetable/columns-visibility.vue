<template>
  <el-dropdown
    :hide-on-click="false"
    placement="bottom-start"
  >
    <el-button type="default" size="medium">
      Колонки
      <i class="el-icon-arrow-down el-icon--right"/>
    </el-button>
    <el-dropdown-menu slot="dropdown" class="columns-dropdown">
      <el-tree
        :data="treeData"
        :default-checked-keys="checkedKeys"
        node-key="id"
        check-on-click-node
        show-checkbox
        :expand-on-click-node="false"
        empty-text=""
        @check-change="handleCheckChange"
      />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: "VueTableColumns",
  props: {
    fields: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    treeData() {
      return this.fields
        .filter(i => !['__slot:actions'].includes(i.name))
        .map(i => ({id: i.name, label: i.title}))
    },
    checkedKeys() {
      // visible default true
      return this.fields
        .filter(i => !(i.visible === false))
        .map(i => i.name)
    }
  },
  methods: {
    handleCheckChange(item, checked) {
      this.$emit("visibility", {key: item.id, checked})
    }
  }
}
</script>

<style scoped lang="stylus">
.columns
  display block
  &-dropdown
    max-height 250px
    overflow-y auto
    padding-right 15px
    & >>> .el-tree-node__content
      height 20px
</style>
