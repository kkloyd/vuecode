<template>
  <el-dialog :visible="visible" :before-close="handleClose" :close-on-click-modal="false" custom-class="el-dialog--scrollable el-dialog--medium" title="Тесты и результаты" top="50px">
    <div>
      <test-button/>
    </div>
    <div style="margin-top: 10px">
      <base-table :items="tableData" :loading="loading" :exclusive-height="50 + 38 + 24 + 10 + 32 + 30 + 50" :page-size="20" size="mini">
        <el-table-column label="Тест">
          <template slot-scope="scope">
            {{ scope.row.test.name }}, {{ scope.row.totalDurationTime }}
          </template>
        </el-table-column>
        <el-table-column label="Результат" width="120">
          <template slot-scope="scope">
            {{ scope.row.result }} из {{ scope.row.test.totalQuestions }}, {{ scope.row.percentage }}%
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="Дата начала" width="150"/>
        <el-table-column prop="endDate" label="Дата завершения" width="150"/>
        <el-table-column width="50" align="center">
          <template slot-scope="scope">
            <el-button :loading="loadingItem.download[scope.row.test.id]" type="default" size="mini" icon="el-icon-document" title="cкачать PDF" @click="download(scope.row.test)"/>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </el-dialog>
</template>
<script>
import TestButton from "@/pages/test/test-button"
import http from "@/services/http"
import {deepClone} from "@/lib/utils"
import moment from "moment"

export default {
  name: "TestResults",
  components: {
    TestButton,
  },
  props: {
    "visible": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tableData: [],
      loading: false,
      loadingItem: {
        download: {}
      },
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      http.get("testsessions/summary")
        .then(data => {
          this.setData(data)
        })
        .catch(e => {
          this.setData()
          throw e
        })
        .finally(() => {
          this.loading = false
        })
    },
    setData(data = []) {
      this.tableData = data.map(item => {
        item.startDate = moment.utc(item.startDate).local().format("DD.MM.YYYY HH:mm:ss")
        item.endDate = moment.utc(item.endDate).local().format("DD.MM.YYYY HH:mm:ss")
        item.percentage = item.test.totalQuestions ? +((item.result / item.test.totalQuestions * 100)).toFixed(1) : 0
        let timeFormat = ""
        if (Math.floor(item.test.totalDuration / 3600)) timeFormat += "H час"
        if (Math.floor(item.test.totalDuration / 60)) timeFormat += " m мин"
        if (item.test.totalDuration % 60) timeFormat += " s сек"
        item.totalDurationTime = moment.utc(item.test.totalDuration * 1000).format(timeFormat)
        return item
      })
    },
    download({id, name} = {}) {
      this.setLoadingItem({key: "download", id, value: true})
      let endpoint = `testsessions/print/${id}`
      http.download({method: "post", path: endpoint, filename: name, fileType: "pdf"})
        .finally(() => {
          this.setLoadingItem({key: "download", id, value: false})
        })
    },
    setLoadingItem({key, id, value}) {
      let loadingItem = deepClone(this.loadingItem[key])
      loadingItem[id] = value
      this.$set(this.loadingItem, key, loadingItem)
    },
    close() {
      this.$emit("close")
    },
    handleClose(done) {
      this.close()
      done()
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags
  margin 0
</style>
