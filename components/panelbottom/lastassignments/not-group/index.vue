<template>
  <div v-if="tableData" class="fx-table">
    <div v-if="tableChemistry.length || tableFertilizer.length || tableLast" class="fx-table">
      <div class="fx-row fx-grey">
        <div class="fx-cell" style="cursor: pointer;" @click="visible = !visible">
          {{ visible ? "-" : "+" }} Работа
        </div>
        <div class="fx-cell">
          Дата
        </div>
        <div class="fx-cell">
          Препарат
        </div>
        <div class="fx-cell">
          Примечание
        </div>
        <div class="fx-cell">
          Площадь обработки
        </div>
        <div class="fx-cell">
          % поля
        </div>
      </div>
    </div>
    <div v-if="tableChemistryLast" v-show="visible" class="fx-table">
      <div class="fx-row">
        <button class="fx-cell fx-button fx-light-grey">
          {{ tableChemistryLast.workName }}
        </button>
        <div class="fx-cell">
          {{ tableChemistryLast.date.startFormated }}
        </div>
        <div class="fx-cell">
          <el-tag v-for="item in tableChemistryLast.chemistryChemicalTreatments" :key="item.id" size="small">
            {{ item.chemicalPreparationName }} ({{ item.factNormative }})
          </el-tag>
        </div>
        <div class="fx-cell">
          <el-tag v-for="item in tableChemistryLast.chemistryLimitWeedTypes" :key="item.id" size="small">
            {{ item.weedName || item.weedTypeName }} ({{ item.weedAmount }})
          </el-tag>
        </div>
        <div class="fx-cell">
          {{ tableChemistryLast.area }}
        </div>
        <div class="fx-cell">
          {{ getAreaPercentage(fieldClickedId, tableChemistryLast.area) }}
        </div>
      </div>
    </div>
    <div v-if="tableChemistry.length" v-show="visible">
      <div v-for="(table, index) in tableChemistry" :key="index" class="fx-table">
        <div class="fx-row">
          <div class="fx-cell">
            {{ table.workName }}
          </div>
          <div class="fx-cell">
            {{ table.date.startFormated }}
          </div>
          <div class="fx-cell">
            <el-tag v-for="item in table.chemistryChemicalTreatments" :key="item.id" size="small">
              {{ item.chemicalPreparationName }} ({{ item.factNormative }})
            </el-tag>
          </div>
          <div class="fx-cell">
            <el-tag v-for="item in table.chemistryLimitWeedTypes" :key="item.id" size="small">
              {{ item.weedName || item.weedTypeName }} ({{ item.weedAmount }})
            </el-tag>
          </div>
          <div class="fx-cell">
            {{ table.area }}
          </div>
          <div class="fx-cell">
            {{ getAreaPercentage(fieldClickedId, table.area) }}
          </div>
        </div>
      </div>
    </div>
    <template v-if="tableFertilizer && tableFertilizer.length">
      <div v-for="(table, index) in tableFertilizer" v-show="visible" :key="index" class="fx-table">
        <div class="fx-row">
          <div class="fx-cell">
            {{ table.workName }}
          </div>
          <div class="fx-cell">
            {{ table.date.startFormated }}
          </div>
          <div class="fx-cell">
            <el-tag v-for="item in table.chemistryChemicalTreatments" :key="item.id" size="small">
              {{ item.chemicalPreparationName }} ({{ item.factNormative }})
            </el-tag>
          </div>
          <div class="fx-cell" style="line-height: normal;">
            {{ table.car }} + {{ table.instrument }}
          </div>
          <div class="fx-cell">
            {{ table.area }}
          </div>
          <div class="fx-cell">
            {{ getAreaPercentage(fieldClickedId, table.area) }}
          </div>
        </div>
      </div>
    </template>
    <div v-if="tableLast" v-show="visible" class="fx-table">
      <div class="fx-row">
        <div class="fx-cell">
          {{ tableLast.workName }}
        </div>
        <div class="fx-cell">
          {{ tableLast.date.startFormated }}
        </div>
        <div class="fx-cell">
          -
        </div>
        <div class="fx-cell" style="line-height: normal;">
          {{ tableLast.car }} + {{ tableLast.instrument }}
        </div>
        <div class="fx-cell">
          {{ tableLast.area }}
        </div>
        <div class="fx-cell">
          {{ getAreaPercentage(fieldClickedId, tableLast.area) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchEntities, fromVuex} from "@/services/entity-loader"
import moment from "moment"
import {deepClone} from "@/lib/utils"

export default {
  props: {
    "fieldClickedId": {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      tableChemistryLast: null,
      tableChemistry: [],
      tableFertilizer: [],
      tableLast: null,
      fields: [],
      fieldlastassignments: [],
      visible: false,
    }
  },
  computed: {
    tableData() {
      let tableData = []
      if (this.lastarray.length > 0) {
        let cloned = deepClone(this.lastarray)
        tableData = cloned.find(x => x.fieldId === this.fieldClickedId)
        if (tableData) {
          this.tableChemistry = tableData.chemistry
          this.tableChemistryLast = this.tableChemistry.pop()
          this.tableFertilizer =  tableData.fertilizer
          this.tableLast = tableData.lastWork
        }
      }
      return tableData
    },
    lastarray() {
      let array = []
      if (this.fieldlastassignments.length > 0) {
        let cloned = deepClone(this.fieldlastassignments)
        array = cloned.map(x => {
          if (x.chemistry.length > 0) {
            this.dateFormat(x.chemistry);
          }
          if (x.fertilizer.length > 0) {
            this.dateFormat(x.fertilizer);
          }
          if (x.lastWork) {
            x.lastWork.date.startFormated = moment(x.lastWork.date.start).format("DD.MM.YYYY")
          }
          return x
        });
      }
      return array
    },
  },
  created() {
    fetchEntities([
      "fields",
      "fieldlastassignments",
    ], this.afterFetch);
  },
  methods: {
    afterFetch() {
      this.fields = fromVuex("fields")
      this.fieldlastassignments = fromVuex("fieldlastassignments")
    },
    dateFormat(array) {
      array.map(y => {
        y.date.startFormated = moment(y.date.start).format("DD.MM.YYYY")
      })
    },
    getAreaPercentage(fieldId, area) {
      return ((area * 100) / this.fields.find(f => f.id == this.fieldClickedId).area).toFixed(2)
    },
  }
}
</script>
