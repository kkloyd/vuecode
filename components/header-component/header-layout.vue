<template>
  <header class="header">
    <div :class="['top-panel', topPanelClass]">
      <div class="menu">
        <slot name="header-layout-logo"/>
        <slot name="header-layout-menu"/>
      </div>
      <div class="controls">
        <slot name="header-layout-controls"/>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderLayout",
  computed: {
    topPanelClass() {
      return this.$store.getters["WidthToggle/getWidth"] == "full-width" ? "top-panel--full" : "top-panel--fixed"
    },
  },
}
</script>

<style lang="stylus" scoped>
.header
  flex 0 0 auto
  display flex
  justify-content center
  height 60px
  position relative
  width inherit
  z-index 999
  background #324057
  .top-panel--fixed
    width 1366px
  .top-panel--full
    width 100%
  .top-panel
    flex 0 0 auto
    display flex
    justify-content space-between
    height inherit
    position relative
    background inherit
    .menu
      display flex
      justify-content space-between
      height inherit
    .controls
      display flex
      justify-content space-between
      align-items center
      height 32px
      padding calc((60px - 32px) / 2) 10px
      > *
        height inherit
      > *:not(:last-child)
        margin-right 5px
    >>> .el-menu
      display inline-block
    >>> .el-menu--horizontal .el-menu-item
      padding 0 13px
      height 60px
      line-height 60px
      box-sizing border-box
      float none
      display flex
    >>> .el-button-group
      .el-button
        padding 8px
</style>
