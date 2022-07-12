<template>
  <el-menu :default-active="path" mode="horizontal">
    <transition-group name="list-menu" tag="div" class="list-menu">
      <template v-for="item in filteredByRoles">
        <a :id="item.id" :key="item.index" :href="`/#/${appModule}/${item.index}`" :target="item.target" class="list-menu-item">
          <el-menu-item :index="`/${appModule}/${item.index}`"
                        :class="{'is-really-active': path == `/${appModule}/${item.index}`}"
          >
            {{ item.name }}
          </el-menu-item>
        </a>
      </template>
      <template v-if="filteredByRoles.length">
        <slot/>
      </template>
    </transition-group>
  </el-menu>
</template>

<script>
export default {
  name: "HeaderMenu",
  props: {
    "sections": {
      type: Array,
      default: () => []
    },
  },
  computed: {
    user() {
      return this.$store.getters["Auth/getProfile"]
    },
    appModule() {
      return this.$store.getters["App/getModule"]
    },
    items() {
      if (this.$store.getters["HeaderSearch/getSearchState"]) {
        return []
      } else {
        return this.sections
      }
    },
    filteredByRoles() {
      return this.items.filter(i => {
        if (i.index === "management")
          return this.user.roles.find(r => (r === 'GlobalAdmin' || r === 'Developer')) ? true : false
        return true
      })
    },
    path() {
      return this.$route.path.split("/").slice(0, 3).join("/")
    },
  },
}
</script>
<style lang="stylus" scoped>
.list-menu
  display flex
  position absolute
.list-menu-item
  flex 0 0 auto
  display inline-block
  text-decoration none
  position relative
.list-menu-enter-active
  transition all .2s ease-out
.list-menu-leave-active
  transition all .2s ease-in
.list-menu-enter, .list-menu-leave-to
  opacity 0
  transform translate(-10px, 0)
.el-menu--horizontal >>> .el-menu-item.is-really-active
  color #ffffff !important
  border-bottom 5px solid #20a0ff !important
</style>
