<template>
  <el-dialog :visible="visible" title="История изменения качественных характеристик" :before-close="handleClose">
    <el-button :disabled="!itemId" class="excel" type="text" size="medium" style="position: absolute; top: 10px; right: 50px; z-index: 999"
               @click="exportTable()"
    />
    <div v-if="rendering">
      <base-table :items="data" :loading="loading">
        <base-table-column v-for="col in cols" :key="col.prop" :prop="col.prop" :label="col.label"/>
      </base-table>
    </div>
  </el-dialog>
</template>

<script>
import http from "@/services/http"
export default {
  name: "QualityHistoryComponent",
  props: {
    "itemId": {
      type: Number,
      default: null
    },
    "visible": {
      type: Boolean,
      default: false
    },
    "isTranslation": {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      cols: [],
      rendering: false
    }
  },
  watch: {
    itemId: {
      handler: function (val) {
        if (val) {
          this.init(val)
        }
      },
      immediate: true
    },
  },
  methods: {
    init(id) {
      this.cols = []
      this.data = []
      this.loading = true
      const body = {
        id,
        isTranslation: this.isTranslation
      }
      http.post("QualityTypesHistoryReport/items", body).then(response => {
        let cols = []
        cols.push({
          prop: "name0",
          label: "Качество",
          key: 0,
        })
        if (response.dateTimeAndUsers.length > 0) {
          response.dateTimeAndUsers.forEach((x, indx) => {
            cols.push({
              prop: "name" + (indx + 1),
              label: x,
              key: indx + 1
            })
          })
        }
        if (response.qualityTypes.length > 0 && response.histories.length > 0) {
          let data = response.qualityTypes.map(x => {
            let item = {}
            cols.forEach(o => {
              if (o.prop === "name0") {
                item[o.prop] = x
              } else {
                let find = response.histories.filter(ii => ii.qualityType === x).find(i => i.dateTimeAndUser === o.label)
                if (find) {
                  if (find.isChanged) {
                    item[o.prop] = find.value === "'[добавлено] - 0" ? "" : find.value
                    item["changed" + o.key] = find.isChanged
                  }
                } else {
                  item[o.prop] = ""
                  item["changed" + o.key] = false
                }
              }
            })
            return item
          })
          this.data = data
          this.cols = cols
          this.rendering = true
        }
      }).finally(() => this.loading = false)
    },
    handleClose(done) {
      this.data = []
      this.$emit("close")
      done()
    },
    exportTable() {
      this.loading = true
      const body = {
        id: this.itemId,
        isTranslation: this.isTranslation
      }
      http.downloadXLS("QualityTypesHistoryReport", body, "История").then(response => {
      }).finally(() => this.loading = false)
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>
