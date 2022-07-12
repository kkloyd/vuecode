<template>
  <div class="table-wrapper">
    <el-popover
      v-model="popover.visible"
      :content="customPopoverContent || popover.content"
      :popper-class="popover.class" placement="top" width="150" trigger="manual"
    />
    <vuetable
      ref="vuetable"
      class="custom-table"
      :api-mode="false"
      :fields="fields"
      :per-page="perPage"
      no-data-template=" "
      :data-manager="dataManager"
      pagination-path="pagination"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:row-clicked="handleRowClick"
    >
      <template v-for="f in customFields" v-slot:[f]="props">
        <slot :name="f" :props="props"/>
      </template>
    </vuetable>
    <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 15px;">
      <span v-if="tableData.length" style="font-size: 13px;">
        Всего {{ tableData.length }}, {{ Math.ceil(tableData.length/perPage) }} стр
      </span>
      <vuetable-pagination ref="pagination" class="custom-pagination" @vuetable-pagination:change-page="onChangePage"/>
    </div>
  </div>
</template>

<script>
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination'
import _ from "lodash"
import dateFilter from "@/filters/date-filter"
import {create} from "jss"
import preset from "jss-preset-default"

const jss = create(preset())
const sheet = jss.createStyleSheet({}, {link: true})

export default {
  name: "VueTable",
  components: {
    Vuetable,
    VuetablePagination,
  },
  props: {
    perPage: {
      type: Number,
      default: 20
    },
    fields: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    customPopoverContent: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      customFields: [],

      popover: {
        rowId: null,
        visible: false,
        content: null,
        class: ""
      }
    }
  },
  watch: {
    fields() {
      this.$refs.vuetable.normalizeFields()
    },
    tableData() {
      this.$refs.vuetable.refresh()
    }
  },
  mounted() {
    this.customFields = this.fields
      .filter(i => i.name.includes("__slot:"))
      .map(i => i.name.replace('__slot:', ''))
  },
  methods: {
    dataManager(sortOrder, pagination) {
      if (this.tableData.length < 1) return {pagination: null, data: []}

      let local = this.tableData

      // sortOrder can be empty, so we have to check for that as well
      if (sortOrder.length > 0) {
        local = _.orderBy(
          local,
          sortOrder[0].sortField,
          sortOrder[0].direction
        )
      }

      pagination = this.$refs.vuetable.makePagination(
        local.length,
        this.perPage
      )
      let from = pagination.from - 1
      let to = from + this.perPage

      return {
        pagination: pagination,
        data: _.slice(local, from, to)
      }
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },

    handleRowClick(row, event) {
      const content = this.getPopoverContent(row)
      if (this.popover.rowId === row.id && this.popover.content === content && this.popover.visible)
        this.popover.visible = false
      else {
        this.popover.visible = true
        this.popover.rowId = row.id
        this.popover.class = this.createPopoverClass(event)
        this.popover.content = content
      }
    },
    getPopoverContent(row) {
      let datePrefix = row.dateModified
        ? (row.dateModified === row.dateCreated ? "Создано" : "Изменено")
        : (row.dateModified || row.dateCreated ? "Создано" : "")
      if (row.modifiedBy === "00000000-0000-0000-0000-000000000000") {
        datePrefix += datePrefix ? " системой" : "Создано системой"
      }
      let dateModified = row.dateModified ? dateFilter(row.dateModified, "YYYY-MM-DDTHH:mm:ss", "DD.MM.YYYY HH:mm") : ""
      let dateCreated = row.dateCreated ? dateFilter(row.dateCreated, "YYYY-MM-DDTHH:mm:ss", "DD.MM.YYYY HH:mm") : ""
      let date = dateModified || dateCreated
      let author = row.modifiedByName
      let fromMobile = row.fromMobile ? "Создано с мп" : ""
      let content = [datePrefix, date, author, fromMobile].join("\n")
      return content.trim()
    },
    createPopoverClass(event) {
      let name = "popoverClass"
      let options = {className: "popoverClass"}
      let left = event.clientX
      let top = event.clientY
      let style = {position: "absolute", left: `${left}px !important`, top: `${top}px !important`, whiteSpace: "pre-line"}
      sheet.deleteRule(name)
      sheet.addRule(name, style, options)
      sheet.detach()
      sheet.attach()
      let className = sheet.getRule(name).selectorText.slice(1)
      return className
    },
  }
}
</script>


<style scoped lang="scss">
.table-wrapper {
  ::v-deep .custom-table {
    border-top: 1px solid #D4D4D5;

    thead th, tbody td {
      font-size: 14px;
    }
  }

  ::v-deep .custom-pagination {
    & > a {
      min-width: 5px !important;
      padding: 15px !important;
      font-size: 14px;
    }
  }
}
</style>
