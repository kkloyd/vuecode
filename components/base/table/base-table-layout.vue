<template>
  <div class="el-table-cont">
    <slot/>
    <slot name="popover"/>
    <slot name="table"/>
    <slot name="pagination"/>
  </div>
</template>

<script>
export default {
  name: "BaseTableLayout",
}
</script>
