<template>
  <el-dialog :visible="visible" title="История изменений" :before-close="handleClose" custom-class="el-dialog--large">
    <el-button :disabled="loadingExcel" class="excel" type="text" size="medium" style="position: absolute; top: 10px; right: 50px; z-index: 999"
               @click="exportTable()"
    />
    <div v-if="rendering">
      <base-table :items="data" :loading="loading" size="mini" class="base-table">
        <base-table-column v-for="col in cols" :key="col.prop" :prop="col.prop"
                           :label="col.label" :fixed="col.prop === 'name0'" min-width="250"
        />
      </base-table>
    </div>
  </el-dialog>
</template>

<script>
import http from "@/services/http"
import moment from "moment";
export default {
  name: "CalculationHistoryComponent",
  props: {
    "itemId": {
      type: Number,
      default: null
    },
    "visible": {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      loadingExcel: false,
      rendering: false,
      cols: [],
      title: null
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
      http.get(`ChangeLogs?ObjectId=${id}&Type=${this.type}`).then(response => {
        let cols = []
        cols.push({
          prop: "name0",
          label: "Параметр",
          key: 0,
        })
        if (response.dateTimeAndUsers.length > 0) {
          let dateTimeAndUsers = response.dateTimeAndUsers
          let dates = dateTimeAndUsers.map(i => i.split(",")[0]).sort((a, b) => {
            return (new Date(moment(a, "DD.MM.YYYY HH:mm:ss").toDate()) - new Date(moment(b, "DD.MM.YYYY HH:mm:ss").toDate()))
          })
          let newDateTimeAndUsers = []
          dates.forEach(i => {
            let a = dateTimeAndUsers.find(j => j.indexOf(i) > -1)
            newDateTimeAndUsers.push(a)
          })
          newDateTimeAndUsers.forEach((x, indx) => {
            cols.push({
              prop: "name" + (indx + 1),
              label: x,
              key: indx + 1
            })
          })
        }
        if (response.parameters.length > 0 && response.histories.length > 0) {
          let data = response.parameters.map(x => {
            let item = {}
            cols.forEach(o => {
              if (o.prop === "name0") {
                item[o.prop] = x
              } else {
                let find = response.histories.filter(ii => ii.parameter === x).find(i => i.dateTimeAndUser === o.label)
                if (find) {
                  item[o.prop] = find.value === "'[добавлено] - 0" ? "" : find.value
                } else {
                  item[o.prop] = ""
                }
              }
            })
            return item
          })
          this.data = data
          this.cols = cols
          this.rendering = true
        }
      }).finally(() => {
        this.loading = false
        this.rendering = true
      })
    },
    handleClose(done) {
      this.data = []
      this.$emit("close")
      done()
    },
    exportTable() {
      this.loadingExcel = true
      const body = {
        "ObjectId": this.itemId,
        "Type": this.type
      }
      http.downloadXLS("ChangeLogsExcel", body, "История изменения").then(response => {
      }).finally(() => this.loadingExcel = false)
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>
