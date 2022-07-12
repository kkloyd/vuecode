<template>
  <div>
    <header-menu-more :visible="headerMenuMoreVisible" @close="headerMenuMoreVisible = false"/>
    <header-layout>
      <slot slot="header-layout-logo" name="logo">
        <a href="/#/modules-tree" class="logoLink">
          <h2 class="logo" v-html="logo"/>
          <span v-if="!IS_PROD" style="font-size: 10px; margin-left: -8px; color: red;">TEST</span>
        </a>
      </slot>
      <slot slot="header-layout-menu" name="menu">
        <header-menu :sections="sections"/>
      </slot>
      <slot slot="header-layout-controls" name="controls">
        <header-search/>
        <el-select v-if="isContext('field') && contextFieldVisible" v-model="contextField" :style="{width: '150px'}" title="Поле" placeholder="Поле" size="small" filterable>
          <el-option v-for="field in fields" :key="field.id" :label="field.newName" :value="field.id"/>
        </el-select>
        <el-select v-if="contextEchelonTypeVisible" v-model="contextEchelonType" :style="{width: '160px'}" title="Тип маршрута" placeholder="маршрут" size="small" filterable>
          <el-option v-for="echelonType in echelonTypes" :key="echelonType.id" :label="echelonType.name" :value="echelonType.id"/>
        </el-select>
        <el-select v-if="!contextEchelonTypeVisible && isContext('budget')" id="context-budget" v-model="contextBudget" :style="{width: '160px'}" title="Бюджет" placeholder="Бюджет" size="small" filterable>
          <el-option v-for="budget in budgets" :key="budget.id" :label="budget.name" :value="budget.id"/>
        </el-select>
        <el-select v-model="contextOrganization" :style="{width: '220px'}" title="Организация" placeholder="Организация" size="small" filterable>
          <el-option :disabled="contextOrganization === organization.id" v-for="organization in organizations" :key="organization.id" :label="organization.name" :value="organization.id"/>
        </el-select>
        <el-select v-if="!isContext('yearOfGrainBalance')" v-model="contextYear" :style="{width: '80px'}" title="Год" placeholder="Год" size="small" filterable>
          <el-option v-for="year in years" :key="year" :label="year" :value="year"/>
        </el-select>
        <el-select v-if="isContext('yearOfGrainBalance')" v-model="contextYear" :style="{width: '125px'}" title="Год урожая" placeholder="Год урожая" size="small" filterable>
          <el-option v-for="year in years" :key="year" :label="`Урожай ${year}`" :value="year"/>
        </el-select>
        <div v-if="user.imageByte" class="avatar-container">
          <img :src="user.imageByte">
        </div>
        <div style="height: 100%; cursor: pointer;" @click="headerMenuMoreVisible = !headerMenuMoreVisible">
          <i class="el-icon-s-grid" style="font-size: 32px; color: #bfcbd9;" title="меню"/>
        </div>
      </slot>
    </header-layout>
  </div>
</template>

<script>
import HeaderLayout from "@/components/header-component/header-layout"
import HeaderMenu from "@/components/header-component/header-menu"
import HeaderMenuMore from "@/components/header-component/header-menu-more"
import HeaderSearch from "@/components/header-component/header-search"

import moment from "moment"
import {fromVuex} from "@/services/entity-loader"

export default {
  name: "HeaderComponent",
  components: {
    HeaderLayout,
    HeaderMenu,
    HeaderMenuMore,
    HeaderSearch,
  },
  props: {
    "sections": {
      type: Array,
      default: () => [],
    },
    "contexts": {
      type: Array,
      default: () => [],
    },
    "logo": {
      type: String,
      default: "<b>Agro</b>stream",
    },
  },
  data() {
    return {
      budgets: [],
      organizations: [],
      fields: [],
      years: [],
      echelonTypes: [],
      headerMenuMoreVisible: false,
      IS_PROD: IS_PROD,
    }
  },
  computed: {
    contextOrganization: {
      get: function () {
        return this.$store.getters["Contexts/getOrganization"]
      },
      set: function (val) {
        this.$store.dispatch("Contexts/actionSetOrganization", {val, reload: true})
      }
    },
    contextBudget: {
      get: function () {
        return this.$store.getters["Contexts/getBudget"]
      },
      set: function (val) {
        this.$store.dispatch("Contexts/actionSetBudget", {val, reload: true})
      }
    },
    contextYear: {
      get: function () {
        return this.$store.getters["Contexts/getYear"]
      },
      set: function (val) {
        this.$store.dispatch("Contexts/actionSetYear", {val, reload: true})
      }
    },
    contextField: {
      get: function () {
        return this.$store.getters["Contexts/getField"]
      },
      set: function (val) {
        this.$store.dispatch("Contexts/actionSetField", {val})
      }
    },
    contextEchelonType: {
      get: function () {
        return this.$store.getters["Contexts/getEchelonType"]
      },
      set: function (val) {
        this.$store.dispatch("Contexts/actionSetEchelonType", {val, reload: true})
      }
    },
    contextEchelonTypeVisible() {
      return this.$route.fullPath === "/agroplan/echelons"
    },
    contextFieldVisible() {
      return this.$route.path.includes("/agromap/field/")
    },
    user() {
      return this.$store.getters["Auth/getProfile"]
    },
  },
  created() {
    this.organizations = fromVuex("userorganizations")
    this.years = Array.from({length: 8}, (v, i) => i + moment().year() - 5)
    if (this.isContext("budget")) {this.budgets = fromVuex("budgets")}
    if (this.isContext("field")) {this.fields = fromVuex("fields")}
    if (this.isContext("echelonType")) {this.echelonTypes = fromVuex("echelonTypes")}
  },
  methods: {
    isContext(name) {
      return this.contexts.includes(name)
    },
  },
}
</script>

<style lang="stylus" scoped>
.logoLink
  display flex
  align-items center
  text-decoration none
  :hover
    cursor pointer

.logo
  font-size 21px
  color #fff
  margin 0
  padding 0 15px
  >>> b
    color #7fe67f

.avatar-container
  img
    max-width 32px
    height inherit
    border-radius 4px
</style>
