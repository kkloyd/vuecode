<template>
  <div class="map-main-filter">
    <div class="search-block">
      <el-input v-model="searchText" class="search-input" suffix-icon="el-icon-search" placeholder="Поиск"/>
      <el-button class="search-reset" type="text" title="Сбросить фильтр" size="medium" @click="nullSearch()">
        Сбросить
      </el-button>
    </div>
    <div :class="{'rerender': rerender}" class="filter-contents">
      <div class="fc-container">
        <div v-for="(item, index) in filteredFields" :key="index" :class="{'active': item.active}" class="fc-row" @click="clickField(item)">
          {{ item.newName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from "@/services/EventBus"
import {deepClone} from "@/lib/utils"

export default {
  props: {
    "fields": {
      type: Array,
      default: () => [],
    },
    "empty": {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      titleField: "Поля ()",
      searchText: "",
      rerender: false,
      filteredFields: [],
      selectedField: null,
    }
  },
  watch: {
    "fields"(val) {
      if (val.length > 0) {
        this.initData()
      }
    },
    "searchText"(val) {
      if (this.empty) {
        if (val && val.length > 0) {
          this.searchFilter()
        } else {
          this.filteredFields = []
        }
      } else {
        this.searchFilter()
      }
    }
  },
  created() {
    EventBus.$on("MapApplyFieldFilter", fieldId => {
      this.applyFilter(fieldId)
    })
    EventBus.$on("GrainBalanceMapFieldFilterFormatNames", vuexFields => {
      this.filteredFields.forEach(field => {
        let found = vuexFields.find(v => v.id === field.id)
        field.newName = found ? found.newName : field.newName
      })
    })
  },
  methods: {
    initData() {
      this.deepCloneData()
      this.addTitle()
      this.nullActive()
    },
    searchFilter() {
      this.filteredFields = deepClone(this.fields).filter(x => x.newName.toLowerCase().includes(this.searchText.toLowerCase()))
    },
    deepCloneData() {
      this.filteredFields = this.empty ? [] : deepClone(this.fields)
    },
    clickField(item, withEventBus = true) {
      this.nullActive()
      item.active = !item.active
      this.selectedField = item.id
      if (withEventBus) {
        EventBus.$emit("MapFieldFilterChanged", this.selectedField)
      }
    },
    nullActive() {
      this.nullActiveArray(this.filteredFields)
      this.reRender()
    },
    nullActiveArray(array) {
      array.forEach(a => {
        a.active = false
        return a
      })
    },
    nullSearch() {
      this.searchText = ""
      this.nullActive()
    },
    applyFilter(fieldId) {
      let found = this.filteredFields.find(field => field.id === fieldId)
      if (found)
      {this.clickField(found, false)}
      else
      {this.nullActive()}
      this.nullActive()
    },
    addTitle() {
      this.titleField = `Поля (${this.fields.length})`
    },
    reRender() {
      this.rerender = !this.rerender
    }
  }
}

</script>

<style lang="stylus" scoped>
.map-main-filter
  float left
  width calc(100% - 30px)
  box-sizing border-box
  margin 0 15px 25px
.search-block
  float left
  width 100%
  padding 15px 0 5px
  position sticky
  top 0
  left 0
  background #eef1f6
  z-index 10
.search-input
  float left
  width 230px
  box-sizing border-box
.search-reset
  float left
  width calc(100% - 230px)
  font-size 12px
  cursor pointer
  color #20a0ff
  box-sizing border-box
.filter-contents
  float left
  width 100%
  margin-top 10px
  .fc-container
    float left
    width 100%
    .fc-row
      float left
      width 100%
      height auto
      line-height 26px
      font-size 12px
      cursor pointer
      padding 0px 52px 0 5px
      box-sizing border-box
      position relative
      &:after
        display none
        content '\2713'
        color #08ff00
        color #20a0ff
        position absolute
        top 0px
        right 5px
      &:hover
        background #858585
      &.active
        background #525252
        &:after
          display block
</style>
