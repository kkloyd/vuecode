<template>
  <div :class="{ 'fx-wide': wide }" class="fx-table">
    <div v-if="fieldClickedName" class="fx-row fx-light-grey">
      <div class="fx-cell">
        {{ fieldClickedName }}
      </div>
    </div>
    <div class="fx-row fx-light-grey">
      <div class="fx-cont-xls" title="скачать">
        <el-button class="excel" type="default" size="medium" @click="exportTable()"/>
      </div>
      <button class="fx-cell fx-button" style="cursor: pointer;" @click="visible = !visible">
        {{ visible ? "-" : "+" }} Севооборот
      </button>
      <div v-for="(year, index) in years" :key="index" class="fx-cell">
        <el-tag v-for="item in year.crops" :key="item.id" :color="item.colorRotation" size="small">
          {{ item.culture }}
        </el-tag>
      </div>
    </div>
    <div v-show="visible">
      <div class="fx-row">
        <div class="fx-cell fx-head">
          Год
        </div>
        <div v-for="(year, index) in years" :key="index" class="fx-cell" style="text-align:center;">
          {{ year.year }}
        </div>
      </div>
      <div class="fx-row">
        <div class="fx-cell fx-head">
          Урожайность
        </div>
        <div v-for="(year, index) in years" :key="index" class="fx-cell">
          <el-tag v-for="item in year.crops" :key="item.id" :color="item.color" size="small">
            {{ item.yield }}
          </el-tag>
        </div>
      </div>
      <div class="fx-row">
        <div class="fx-cell fx-head">
          Площадь посева
        </div>
        <div v-for="(year, index) in years" :key="index" class="fx-cell">
          <el-tag v-for="item in year.crops" :key="item.id" :color="item.color" size="small">
            {{ item.sowingArea }}
          </el-tag>
        </div>
      </div>
      <div class="fx-row">
        <div class="fx-cell fx-head">
          Репродукция
        </div>
        <div v-for="(year, index) in years" :key="index" class="fx-cell">
          <el-tag v-for="item in year.crops" :key="item.id" :color="item.color" size="small">
            {{ item.reproduction }}
          </el-tag>
        </div>
      </div>
      <div class="fx-row">
        <div class="fx-cell fx-head">
          Сорт
        </div>
        <div v-for="(year, index) in years" :key="index" class="fx-cell">
          <el-tag v-for="item in year.crops" :key="item.id" :color="item.color" size="small">
            {{ item.sort }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/services/http";
import {getCroprotations} from '@/api/croprotations'
export default {
  props: {
    "fieldClickedId": {
      type: Number,
      default: null,
    },
    "fieldClickedName": {
      type: String,
      default: "",
    },
    "year": {
      type: Boolean,
      default: false,
    },
    "wide": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      colors: {
        0: {color: "#8391a5", name: "grey"},
        1: {color: "#FF8000", name: "orange"},
        2: {color: "#74DF00", name: "green"},
        3: {color: "#2E2EFE", name: "blue"},
        4: {color: "#FFD100", name: "yellow"},
      },
      rotationColors: [
        {id: 0, color: "#00d921", type: "allowed"},
        {id: 1, color: "#ba0000", type: "forbidden"},
        {id: 2, color: "#d9ce00", type: "not recommended"},
      ],
      croprotations: [],
      xlsProps: {},
      xlsName: "Севооборот",
      xls: false,
      visible: false,
      isAgromap: false,
    }
  },
  computed: {
    fromThisYear() {
      return this.year
    },
    changedCroprotations() {
      let array = this.croprotations
      if (array && array.length) {
        array.forEach(a => {
          for (let col in a.columns) {
            a.columns[col].forEach(x => {
              let rotationColor = this.rotationColors.find(r => r.id == x.typeRotation)
              x.rotationColor = rotationColor ? rotationColor.color : this.rotationColors[1].color
            })
          }
        })
      }
      return array
    },
    years() {
      let years = []
      let firstYear = this.$store.getters["Contexts/getYear"] - 1
      if (this.fromThisYear) {
        firstYear = this.$store.getters["Contexts/getYear"]
      }
      let showNumOfYears = 5
      for (var i = 0; i < showNumOfYears; i++) {
        let crops = this.getCropRotationData(this.fieldClickedId, firstYear)
        let culture = ""
        let reproduction = ""
        let sort = ""
        let sowingArea = ""
        let yearYield = ""
        let j = -1
        crops.map(c => {
          if (j < 4) {j++} else {j = 0}
          c.color = this.colors[j].color
          culture += c.culture + " "
          reproduction += c.reproduction + " "
          sort += c.sort + " "
          sowingArea += c.sowingArea + " "
          yearYield += c.yield + " "
          return c
        })
        years.push({
          id: i, crops: crops, year: firstYear,

          culture: culture,
          yield: yearYield,
          sowingArea: sowingArea,
          reproduction: reproduction,
          sort: sort,
        })
        firstYear--
      }
      this.prepareXls(years)
      return years
    },
  },
  watch: {
    fieldClickedId: {
      handler: function (val) {
        if (val) this.getCrop()
      },
    },
  },
  created() {
    if (this.fieldClickedId) this.getCrop()
  },
  mounted() {
    if (this.wide) {
      this.visible = true
    }
  },
  methods: {
    getCrop(){
      const nextYear = this.$store.getters["Contexts/getYear"]
      getCroprotations(this.fieldClickedId, nextYear, this.isAgromap)
        .then(res => {
          this.croprotations = res
        },
        res => {
          this.$message({message: "На это поле нет посевных работ", type: "warning", duration: 3000, showClose: true})
        })
    },
    getCropRotationData(fieldId, year) {
      let croprotation = this.changedCroprotations[0]
      let empty = [{culture: "нет данных", yield: 0, sowingArea: 0, reproduction: "нет данных", sort: "нет данных", colorRotation: this.rotationColors[1].color}]
      if (croprotation) {
        let cropYear = croprotation.columns[year]
        let cropArray = []
        if (cropYear) {
          cropYear.forEach(x => {
            cropArray.push(
              {
                culture: x.culture ? x.culture : "пусто",
                yield: x.yield ? x.yield : 0,
                sowingArea: x.sowingArea ? x.sowingArea : 0,
                reproduction: x.reproduction ? x.reproduction : "пусто",
                sort: x.sort ? x.sort : "пусто",
                colorRotation: x.rotationColor && x.culture ? x.rotationColor : this.rotationColors[1].color
              });
          })
        } else {cropArray = empty}
        return cropArray;
      } else {
        return empty;
      }
    },
    prepareXls(years) {
      //тот же порядок что и в year.push
      let firstCol = ["Севооборот", "Урожайность", "Площадь посева", "Репродукция", "Сорт"]
      let xlsArray = []
      for (let key in years[0]) {
        if ((key != "id") && (key != "crops") && (key != "year")) {
          xlsArray.push({yearTitle: "пусто", name: key})
        }
      }
      let i = 0
      xlsArray.forEach(x => {
        x.yearTitle = firstCol[i]
        i++
      })
      years.forEach(y => {
        for (let key in y) {
          if ((key != "id") && (key != "crops") && (key != "year")) {
            xlsArray.forEach(x => {
              if (key == x.name) {
                x["year" + y.year] = y[key]
              }
            })
          }
        }
      })
      this.xlsProps = {
        yearTitle: "год",
      }
      for (let key in xlsArray[0]) {
        if ((key != "yearTitle") && (key != "name")) {
          this.xlsProps[key] = key.replace("year", "") + " "
        }
      }
      this.xls = xlsArray
    },
    exportTable() {
      let filename = "История изменения"
      let body = {
        fieldId: this.fieldClickedId,
        organizationId: this.$store.getters["Contexts/getOrganization"],
        year: this.$store.getters["Contexts/getYear"]
      }
      return http.downloadXLS("FieldCropRotationReport", body, filename)
    },
  }
}
</script>
<style lang="stylus" scoped>
.fx-cont-xls
  display inline-block
  position absolute
  top 1px
  left 1px
  height 20px
  width 20px
  .excel
    display block
    background-size 15px auto !important
    background-position center center
    height 20px
    width 20px!important
    padding 0
</style>
