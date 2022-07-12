<template>
  <div class="sidebar-menu">
    <template v-if="profileDialogVisible">
      <user-profile :visible="profileDialogVisible" @close="profileDialogVisible = false"/>
    </template>
    <template v-if="rolesDialogVisible">
      <user-roles :visible="rolesDialogVisible" @close="rolesDialogVisible = false"/>
    </template>
    <template v-if="testResultsDialogVisible">
      <test-results :visible="testResultsDialogVisible" @close="testResultsDialogVisible = false"/>
    </template>
    <template v-if="feedbackVisible">
      <feedback :visible="feedbackVisible" @close="feedbackVisible = false"/>
    </template>
    <template v-if="settingsDialogVisible">
      <settings :visible="settingsDialogVisible" @close="settingsDialogVisible = false"/>
    </template>
    <el-drawer
      ref="drawer"
      :visible="drawerVisible"
      :before-close="handleClose"
      :destroy-on-close="false"
      :append-to-body="true"
      :modal="true"
      size="200px"
      title=""
      direction="rtl"
      custom-class="custom-drawer"
    >
      <div>
        <el-menu>
          <template v-for="(item, index) in menu">
            <template v-if="item.visible">
              <div v-if="item.id == 'logout'" :key="`${index}_divider`" class="divider"/>
              <el-menu-item :key="`${index}_item`" :index="item.id" :disabled="item.disabled" @click="item.action">
                <div class="menu-icon-title">
                  <i :class="item.icon "/>
                  <span>
                    {{ item.title }}
                  </span>
                </div>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import localforage from "@/services/localforage"

import UserProfile from "@/components/user-profile"
import UserRoles from "@/components/user-roles"
import TestResults from "@/components/test-results"
import Feedback from "@/components/feedback"
import Settings from "@/components/settings"

import {library, dom, config} from "@fortawesome/fontawesome-svg-core"
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser"
import {faUserShield} from "@fortawesome/free-solid-svg-icons/faUserShield"
import {faPoll} from "@fortawesome/free-solid-svg-icons/faPoll"
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/faTrashAlt"
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons/faPaperPlane"
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons/faDoorOpen"
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog"

library.add(faUser)
library.add(faUserShield)
library.add(faPoll)
library.add(faTrashAlt)
library.add(faPaperPlane)
library.add(faDoorOpen)
library.add(faCog)
config.autoReplaceSvg = "nest"
dom.watch()

export default {
  name: "HeaderMenuMoreComponent",
  components: {
    UserProfile,
    UserRoles,
    TestResults,
    Feedback,
    Settings,
  },
  props: {
    "visible": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menu: [
        {
          id: "profile",
          title: "Профиль",
          action: this.showProfile,
          icon: "fas fa-user",
          disabled: false,
          visible: true,
        },
        {
          id: "roles",
          title: "Роли и права",
          action: this.showRoles,
          icon: "fas fa-user-shield",
          disabled: false,
          visible: true,
        },
        {
          id: "test-results",
          title: "Тесты и результаты",
          action: this.showTestResults,
          icon: "fas fa-poll",
          disabled: false,
          visible: true,
        },
        {
          id: "feedback",
          title: "Обратная связь",
          action: this.showFeedback,
          icon: "fas fa-paper-plane",
          disabled: false,
          visible: true,
        },
        {
          id: "clear-db",
          title: "Очистить БД",
          action: this.clearLocalForage,
          icon: "fas fa-trash-alt",
          disabled: false,
          visible: true,
        },
        {
          id: "settings",
          title: "Настройки",
          action: this.showSettings,
          icon: "fas fa-cog",
          disabled: false,
          visible: true,
        },
        {
          id: "logout",
          title: "Выход",
          action: this.logout,
          icon: "fas fa-door-open",
          disabled: false,
          visible: true,
        },
      ],

      drawerVisible: false,

      profileDialogVisible: false,
      rolesDialogVisible: false,
      testResultsDialogVisible: false,
      feedbackVisible: false,
      settingsDialogVisible: false,
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        this.drawerVisible = val
      },
      immediate: true
    },
  },
  methods: {
    showProfile() {
      this.profileDialogVisible = true,
      this.close()
    },
    showRoles() {
      this.rolesDialogVisible = true
      this.close()
    },
    showTestResults() {
      this.testResultsDialogVisible = true
      this.close()
    },
    showFeedback() {
      this.feedbackVisible = true
      this.close()
    },
    clearLocalForage() {
      let index = this.menu.findIndex(item => item.id == "clear-db")
      this.menu[index].disabled = true
      localforage.clear(() => {
        this.menu[index].disabled = false
        window.location.reload(true)
      })
    },
    logout() {
      this.$router.push("/logout")
    },
    showSettings() {
      this.settingsDialogVisible = true
      this.close()
    },
    close() {
      this.$emit("close")
    },
    handleClose(done) {
      this.close()
      done()
    },
  },
}
</script>

<style lang="stylus">
.custom-drawer
  top 60px !important
  bottom 0px !important
  height calc(100% - 60px) !important
  overflow-y auto !important
  background-color #eef1f6
  & .el-drawer__header
    display none !important
</style>
<style lang="stylus" scoped>
.menu-icon-title
  display grid
  grid-template-columns 20px auto
  grid-template-rows auto
  grid-auto-flow column
  grid-gap 0 10px

.divider
  width 100%
  height 1px
  background-color #d1dbe5
</style>
