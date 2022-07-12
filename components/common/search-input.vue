<template>
  <el-input
    v-model="search"
    :minlength="searchMin"
    :maxlength="searchMax"
    :suffix-icon="search ? '' : 'el-icon-search'"
    clearable
    :placeholder="placeholder"
  />
</template>

<script>
import _ from "lodash"
import {escapeStringRegexp} from "@/lib/utils"

export default {
  name: "SearchInput",
  props: {
    searchMin: {
      type: Number,
      default: 1,
    },
    searchMax: {
      type: Number,
      default: 50,
    },
    placeholder: {
      type: String,
      default: "Поиск"
    },
  },
  data() {
    return {
      search: ""
    }
  },
  watch: {
    search: _.debounce(function (val) {
      let keywords = (escapeStringRegexp(val)).split(" ").filter(item => item)
      this.$emit("apply", keywords)
    }, 300)
  },
}
</script>

<style scoped>

</style>
