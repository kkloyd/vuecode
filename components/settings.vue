<template>
  <el-dialog :visible="visible" :before-close="handleClose" custom-class="el-dialog--tiny" title="Настройки">
    <template v-if="!IS_PROD">
      <div style="margin-bottom: 10px">
        <div>
          env: {{ ENV_KEY }}
        </div>
        <div>
          api url: {{ SERVER_API_URL }}
        </div>
      </div>
    </template>
    <div style="margin-top: 10px">
      <el-switch v-model="width" active-value="fixed-width" active-text="1366px" inactive-value="full-width" inactive-text="100%"/>
    </div>
    <div style="margin-top: 10px">
      <el-switch v-model="theme" active-value="night" active-text="Ночной режим" inactive-value="day" inactive-text="Дневной режим"/>
    </div>
    <div v-if="theme == 'night'" style="margin-top: 10px">
      <el-switch v-model="themeOptions.mode" :active-value="1" active-text="Темный" :inactive-value="0" inactive-text="Тусклый"/>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "Settings",
  props: {
    "visible": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      SERVER_API_URL: SERVER_API_URL,
      IS_PROD: IS_PROD,
      ENV_KEY: ENV_KEY,
    }
  },
  computed: {
    "width": {
      get: function () {
        return this.$store.getters["WidthToggle/getWidth"]
      },
      set: function (val) {
        this.$store.dispatch("WidthToggle/actionSetWidth", val)
      }
    },
    "theme": {
      get: function () {
        return this.$store.getters["Theme/getTheme"]
      },
      set: function (val) {
        this.$store.dispatch("Theme/actionSetTheme", val)
      }
    },
    "themeOptions": {
      get: function () {
        return this.$store.getters["Theme/getOptions"]
      },
    },
  },
  watch: {
    themeOptions: {
      handler: function (val) {
        this.$store.dispatch("Theme/actionSetOptions", val)
      },
      deep: true,
    },
  },
  methods: {
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
