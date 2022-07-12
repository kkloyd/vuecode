<template>
  <base-table-layout>
    <template slot="popover">
      <el-popover ref="popover" v-model="popoverVisible" :content="customPopover || popoverContent"
                  :popper-class="popoverClass" placement="top" width="150" trigger="manual"
      />
    </template>
    <template slot="table">
      <el-table
        ref="base-table"
        v-popover="popoverRef"
        v-loading="loading"
        v-linker="{id: sharedId}"
        :data="items | paginate(page.current, page.size)"
        :max-height="maxHeight"
        :border="border"
        :fit="fit"
        class="content"
        :row-class-name="rowClassName"
        :cell-class-name="cellClassName"
        :cell-style="cellStyle"
        :size="size"
        :summary-method="summaryMethod"
        :span-method="spanMethod"
        :show-summary="showSummary"
        :show-header="showHeader"
        :row-key="rowKey"
        :expand-row-keys="expandRowKeys"
        :highlight-current-row="highlightCurrentRow"
        @row-click="handleRowClick"
        @expand-change="handleExpandChange"
        @mouseleave.native="resetPopover"
        @selection-change="handleSelectionChange"
      >
        <slot/>
      </el-table>
    </template>
    <template v-if="page.size && !hiddenPagination" slot="pagination">
      <table-pagination :total-items="page.total" :items-per-page.sync="page.size"
                        :page.sync="page.current"
      />
    </template>
  </base-table-layout>
</template>
<script>
import WindowResize from "@/mixins/window-resize"
import BaseTableMixin from "@/components/base/table/base-table-mixin"

import BaseTableLayout from "@/components/base/table/base-table-layout"
import TablePagination from "@/components/base/table/table-pagination"

export default {
  name: "BaseTable",
  components: {
    BaseTableLayout,
    TablePagination,
  },
  mixins: [
    WindowResize,
    BaseTableMixin,
  ],
  props: {
    "items": {
      type: Array,
      default: () => [],
    },
    "loading": {
      type: Boolean,
      default: true,
    },
    "exclusiveHeight": {
      type: Number,
      default: null,
    },
    "minHeight": {
      type: Number,
      default: null,
    },
    "pageSize": {
      type: Number,
      default: 20,
    },
    "pageCurrent": {
      type: Number,
      default: 0,
    },
    "border": {
      type: Boolean,
      default: true,
    },
    "fit": {
      type: Boolean,
      default: true,
    },
    "rowClassName": {
      type: Function,
      default: () => "",
    },
    "cellClassName": {
      type: Function,
      default: () => {},
    },
    cellStyle: {
      type: Function,
      default: () => {},
    },
    "handleSelectionChange": {
      type: Function,
      default: () => [],
    },
    "handleExpandChange": {
      type: Function,
      default: () => [],
    },
    "size": {
      type: String,
      default: "small",
    },
    "summaryMethod": {
      type: Function,
      default: () => {},
    },
    "spanMethod": {
      type: Function,
      default: () => {},
    },
    "showSummary": {
      type: Boolean,
      default: false,
    },
    "showHeader": {
      type: Boolean,
      default: true,
    },
    "rowKey": {
    },
    "expandRowKeys": {
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    "sharedId": {
      type: [Number, String],
      default: null,
    },
    hiddenPagination: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    maxHeight() {
      if (this.exclusiveHeight) {
        let maxHeight = this.$store.getters["WindowResize/getHeight"] - this.exclusiveHeight
        maxHeight = (maxHeight > this.minHeight) ? maxHeight : this.minHeight
        return maxHeight
      } else {
        return this.minHeight ? this.minHeight : 450
      }
    },
    pageSizeComputed() {
      return this.hiddenPagination ? this.items.length : this.pageSize
    }
  },
  watch: {
    items: {
      handler: function (val) {
        this.page.total = val.length
        if (!this.pageCurrent) {
          this.page.current = 1
        }
      },
      immediate: true
    },
    pageSizeComputed: {
      handler: function (val) {
        this.page.size = val
      },
      immediate: true
    },
    "page.current": {
      handler: function (val) {
        if (this.pageCurrent) {
          this.$emit("update:pageCurrent", val)
        }
      },
      immediate: true
    }
  },
  created() {
    let {page} = this.$route.query
    if (this.pageCurrent && this.pageCurrent > 0) {
      page = this.pageCurrent
    }
    if (page >= 0) {
      this.page.current = parseInt(page)
    }
    this.$router.replace({query: {}}).catch(err => {})
  },
}
</script>
