<template>
  <div v-if="tree && tree.length" class="columns">
    <el-dropdown
      :hide-on-click="false"
      placement="bottom-start"
    >
      <el-button type="default" :size="size">
        Колонки
        <i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown" class="columns-dropdown">
        <el-tree
          :data="tree"
          :show-checkbox="true"
          check-on-click-node
          :default-expand-all="false"
          :node-key="nodeKey"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          :props="defaultProps"
          empty-text=""
          @check-change="handleCheckChange"
        />
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "BaseColumns",
  props: {
    "sharedId": {
      type: [Number, String],
      default: null,
    },
    "size": {
      type: String,
      default: "medium",
    },
  },
  data() {
    return {
      tree: [],
      nodeKey: "id",
      defaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
        parentId: "parentId",
      },
      defaultCheckedKeys: [],
      defaultCheckedKeysClone: [],
      defaultExpandedKeys: [],
    }
  },
  computed: {
    "columns": {
      get: function () {
        return this.$store.getters["Columns/getColumns"].sort((a, b) => a.id - b.id)
      },
    },
  },
  watch: {
    columns: {
      handler: function (val) {
        let elementId = this.$store.getters["Linker/getLink"](this.sharedId)
        this.tree = this.getTree(elementId)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getTree(elementId) {
      this.defaultCheckedKeysClone = []
      let columns = this.getChildren(elementId)
      this.defaultCheckedKeys = this.defaultCheckedKeysClone
      return columns
    },
    getChildren(parentId) {
      return this.$store.getters["Columns/getColumnsByParent"](parentId)
        .map(item => {
          if (item.defaultValue) {
            this.defaultCheckedKeysClone.push(item.id)
          }
          let obj = {
            id: item.id,
            parentId: item.parentId,
            label: item.label,
            disabled: item.defaultValue === "always",
          }
          let children = this.getChildren(item.id)
          if (children && children.length) {
            obj.children = children
          }
          return obj
        })
    },
    handleCheckChange(data, checked, indeterminate) {
      this.setColumnValue(data, checked || indeterminate)
      if (checked || indeterminate) {
        this.setColumnValueUp(data, true)
      }
    },
    setColumnValue(data, value) {
      if (this.$store.getters["Columns/getColumnValue"](data.id) != value) {
        this.$store.dispatch("Columns/actionSetColumnValue", {id: data.id, value: value})
      }
      if (data.children) {
        data.children.forEach(item => {
          this.setColumnValue(item, value)
        })
      }
    },
    setColumnValueUp(data, value) {
      let item = this.$store.getters["Columns/getColumn"](data.parentId)
      if (item) {
        if (this.$store.getters["Columns/getColumnValue"](data.parentId) != value) {
          this.$store.dispatch("Columns/actionSetColumnValue", {id: data.parentId, value: value})
        }
        this.setColumnValueUp(item, value)
      }
    }
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
