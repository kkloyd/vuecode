<template>
  <div class="cards">
    <el-card :body-style="{padding: '20px 15px 15px 15px'}" class="cards__item">
      <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="cards__item__row">
        <div class="cards__item__row__label">
          {{ row.label }}:
        </div>
        <div class="cards__item__row__value">
          {{ soils[row.prop] }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import http from "@/services/http"
import {fetchEntities, fromVuex} from "@/services/entity-loader"
import moment from "moment"

export default {
  props: {
    "fieldId": {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      rows: [
        {label: "Хим элементы", prop: "formatDate"},
        {label: "Кислотность", prop: "sourness"},
        {label: "Азот", prop: "nitrogen"},
        {label: "Фосфор", prop: "phosphorus"},
        {label: "Калий", prop: "potassium"},
        {label: "Гумус", prop: "organic"},
        {label: "Сера", prop: "sulfur"},
      ],
      soilResearches: null,
      kml: [],
    }
  },
  computed: {
    soils() {
      let format = {
        formatDate: "нет данных",
        sourness: "нет данных",
        nitrogen: "нет данных",
        phosphorus: "нет данных",
        potassium: "нет данных",
        organic: "нет данных",
        sulfur: "нет данных",
      }
      if (this.soilResearches) {
        format = Object.assign({}, this.soilResearches)
        format.formatDate = moment(format.date, "YYYY-MM-DDTHH:mm:ss").format("DD.MM.YYYY HH:mm:ss");
      }
      return format
    },
  },
  watch: {
    "fieldId"(val, oldVal) {
      this.soilResearches = {}
      this.init(val)
    },
  },
  created() {
    this.init(this.fieldId)
    fetchEntities([
      "kml",
    ], this.afterFetch);
  },
  methods: {
    afterFetch() {
      this.kml = fromVuex("kml")
      this.loading = false
    },
    init(fieldId) {
      this.soilResearches = null
      http.getCache(`soilresearches/${this.$store.getters["Contexts/getOrganization"]}/${this.$store.getters["Contexts/getYear"]}/${fieldId}`)
        .then(data => {
          if (this.fieldId == fieldId) {
            this.soilResearches = data
          }
        })
        .catch((error) => {
          this.$message({
            message: `Ошибка ${error}`,
            type: "info",
            duration: 5000,
            showClose: false,
          });
        })
    },
    skipArray(arg, prev) {
      if (Array.isArray(arg)) {
        return this.skipArray(arg[0], arg)
      } else {
        return prev[0] + "," + prev[1]
      }
    },
  },
}
</script>
