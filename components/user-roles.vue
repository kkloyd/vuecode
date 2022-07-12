<template>
  <el-dialog :visible="visible" :before-close="handleClose" :close-on-click-modal="false" custom-class="el-dialog--scrollable el-dialog--small" title="Роли и права" top="50px">
    <div>
      <span>Роли: </span>
      <span class="tags">
        <el-tag v-for="(role, index) in user.roles" :key="index" size="small">
          {{ role }}
        </el-tag>
      </span>
    </div>
    <div style="margin-top: 10px">
      <base-table :items="user.permissions" :loading="false" :min-height="625 - (50 + 38 + 30 + 30 + 10 + 32 + 30)" size="mini">
        <el-table-column prop="businessProcess" label="Бизнес процесс"/>
        <el-table-column label="Доступ">
          <template slot-scope="scope">
            <el-tag v-for="(permission, index) in scope.row.permissionGroups" :key="index" type="info" size="small">
              {{ permission }}
            </el-tag>
          </template>
        </el-table-column>
      </base-table>
    </div>
  </el-dialog>
</template>
<script>
import Auth from "@/services/Auth"
import {deepClone} from "@/lib/utils"

export default {
  name: "UserRoles",
  props: {
    "visible": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      user: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.user = deepClone(Auth.getProfile())
    },
    close() {
      this.$emit("close")
    },
    handleClose(done) {
      this.close()
      done()
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags
  margin 0
</style>
