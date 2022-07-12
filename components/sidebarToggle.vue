<template>
  <div v-show="isSidebarToggleVisible && appReady">
    <transition name="slide-fade" mode="out-in" appear>
      <el-button v-if="sidebarToggleState === true" key="open"
                 :class="['sidebar-toggle', sidebarToggleOpenClass]"
                 size="medium" @click="toggleSidebar()"
      >
        <i class="el-icon-caret-left"/>
      </el-button>
      <el-button v-else key="close" class="sidebar-toggle closed" size="medium" @click="toggleSidebar()">
        <i class="el-icon-caret-right"/>
      </el-button>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    appReady() {
      return this.$store.getters["App/getState"]
    },
    isSidebarToggleVisible() {
      let path = this.$route.path ? this.$route.path : ""
      if (!path || path === "/") return false
      let doNotShowSidebar = [
        "/login",
        "/logout",
        "/modules-tree",
        "/agroplan/sowings",
        "/agroplan/works",
      ]
      let isVisible = !(doNotShowSidebar.some(s => new RegExp("^" + s).test(path)))
      isVisible = isVisible && this.$store.getters["App/getModule"]
      return isVisible
    },
    sidebarToggleState() {
      return this.$store.getters["Sidebar/getToggleState"]
    },
    sidebarToggleOpenClass() {
      return this.$store.getters["WidthToggle/getWidth"] == "full-width" ? "open--full" : "open--fixed"
    },
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("Sidebar/actionSetToggleState", !this.sidebarToggleState);
    },
  },
}
</script>

<style lang="stylus" scoped>
.sidebar-toggle
  position fixed
  top calc(200px + 60px)
  background #eef1f6
  border 1px solid #e4e8f1
  border-left none
  border-radius 0 7px 7px 0
  width 15px
  height 60px
  font-size 0.7rem
  padding 0
  z-index 401
  &.open
    &--full
      left 330px
    &--fixed
      left calc((100% - 1366px) / 2 + 330px)
  &.closed
    left 0
@media only screen and (max-width: 1366px)
  .sidebar-toggle
    position absolute
</style>
