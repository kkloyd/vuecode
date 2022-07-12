<template>
  <div :class="`alert ${type}`" role="alert">
    <div v-if="description" class="alert__description">
      {{ description }}
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseAlert",
  props: {
    "description": {
      type: String,
      default: "",
    },
    "type": {
      type: String,
      default: "info",
    },
  },
}
</script>
<style lang="stylus" scoped>
.alert
  padding 8px 8px
  border-radius 4px
  border-left-width 5px
  border-left-style solid
  &.info
    border-left-color #50bfff
    background-color #ecf8ff
  &.warning
    border-left-color #e6a23c
    background-color #fdf6ec
  &.error
    border-left-color #fe6c6f
    background-color #fff6f7
  &.success
    border-left-color #67c23a
    background-color #f0f9eb
  &__description
    line-height 1.5
</style>
