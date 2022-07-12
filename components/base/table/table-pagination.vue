<template>
  <el-pagination :total="totalItems"
                 :page-size="size"
                 :page-sizes="sizes"
                 :current-page.sync="current"
                 :layout="layout"
                 @current-change="handlePageChange"
                 @size-change="handleSizeChange"
  />
</template>

<script>
export default {
  name: "TablePagination",
  props: {
    "totalItems": {
      type: Number,
      default: null,
    },
    "itemsPerPage": {
      type: Number,
      default: 5,
    },
    "page": {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      current: 1,
      size: 5,
      sizes: [5, 10, 15, 20, 25, 30, 50, 100],
      layout: "total, sizes, prev, pager, next",
      id: "",
    }
  },
  watch: {
    "page"(val) {
      this.setPage(val)
    },
  },
  created() {
    let path = this.$route.path
    let isCatalog = path.split("/").includes("catalog")
    this.id = isCatalog ? path.split("/").slice(2).join("/") : path
    this.init()
  },
  methods: {
    init() {
      this.$store.dispatch("TablePagination/actionInitPageSizes")
      let size = this.$store.getters["TablePagination/getPageSize"](this.id)
      if (size) {
        this.$emit("update:itemsPerPage", size)
        this.size = size
      } else {
        this.setPageSize(this.itemsPerPage)
      }
      this.sizes[this.sizes.findIndex(size => size == this.size)] = this.sizes[0]
      this.sizes[0] = this.size
      this.setPage(this.page, false)
    },
    setPageSize(num) {
      this.$store.dispatch("TablePagination/actionSetPageSizes", {id: this.id, size: num})
      this.size = this.$store.getters["TablePagination/getPageSize"](this.id)
      this.$emit("update:itemsPerPage", num)
    },
    setPage(num = 1, emit = true) {
      this.$store.dispatch("TablePagination/actionSetPage", num)
      this.current = this.$store.getters["TablePagination/getPage"]
      if (emit) this.$emit("update:page", num)
    },
    handlePageChange(num) {
      this.setPage(num)
    },
    handleSizeChange(num) {
      this.setPageSize(num)
      if (this.current > Math.ceil(this.totalItems / this.size)) this.setPage()
    },
  },
}
</script>
