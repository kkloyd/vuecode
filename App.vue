<template>
  <div id="app-container" v-loading.fullscreen.lock="!appReady || transition" translate="no" :class="transition ? 'fade-out' : 'fade-in'">
    <router-view v-if="appReady"/>
  </div>
</template>

<script>
import Auth from "@/services/Auth"
import {fetchEntities} from "@/services/entity-loader"
import {modules} from "@/modules.js"

import Contexts from "@/mixins/contexts"
import PageViewRecords from "@/mixins/page-view-records"
import RoutesManager from "@/mixins/routes-manager"

export default {
  mixins: [
    Contexts,
    PageViewRecords,
    RoutesManager,
  ],
  computed: {
    appReady() {
      return this.$store.getters["App/getState"]
    },
    transition() {
      return this.$store.getters["Router/getTransition"]
    },
    authStatus() {
      return this.$store.getters["Auth/getStatus"]
    },
    module: {
      get: function () {
        return this.$store.getters["App/getModule"]
      },
      set: function (val) {
        this.$store.dispatch("App/actionSetModule", val)
      }
    },
  },
  watch: {
    "$route.path": {
      handler: function (val) {
        let module = val.split("/")[1]
        this.module = Object.keys(modules).find(key => key === module)
      },
      immediate: true,
    },
    authStatus: {
      handler: function (val) {
        if (val == "success") {
          this.loadProfile()
        }
      },
    },
  },
  created() {
    this.$store.dispatch("WidthToggle/actionInitWidth")
    this.$store.dispatch("Theme/actionInitTheme")
    this.loadProfile()
  },
  methods: {
    loadProfile() {
      if (Auth.isAuthenticated()) {
        this.$store.dispatch("App/actionSetState", false)
        this.$store.dispatch("Contexts/actionInitContexts")
        Auth.loadProfile().then(data => {
          if (data) {
            this.afterLoadProfile(data)
          } else {
            Auth.logout()
          }
        }).catch((e) => {
          if (e && e.response && e.response.status == 401) Auth.logout()
          throw e
        })
      }
    },
    afterLoadProfile({hasRegistered, organizationId, organizationsGroupId}) {
      if (hasRegistered) {
        this.$store.dispatch("Contexts/actionSetOrganization", {val: organizationId})
        this.$store.dispatch("Contexts/actionSetOrganizationsGroupId", {val: organizationsGroupId})
        fetchEntities(["userorganizations"], () => {
          this.$store.dispatch("App/actionSetOrganizationType")
          this.$store.dispatch("App/actionSetState", true)
          this.$store.dispatch("Contexts/actionSetOrganizationGuid")
        })
      } else {
        this.$message({
          showClose: false,
          duration: 5000,
          message: "Пользователь не зарегистрирован",
          type: "error"
        })
      }
    },
  }
}
</script>
