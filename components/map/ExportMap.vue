<template>
  <el-button :loading="exportLoading" plain type="primary" size="medium" @click="downloadFile(url, filename)">
    {{ title }}
  </el-button>
</template>

<script>
import http from "@/services/http"

export default {
  props: {
    "title": {
      type: String,
      default: "",
    },
    "url": {
      type: String,
      default: "",
    },
    "filename": {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      exportLoading: false,
    }
  },
  methods: {
    downloadFile(endpoint, filename) {
      this.exportLoading = true
      http.downloadFile(endpoint, filename)
        .finally(() => {
          this.exportLoading = false
        })
    }
  }
}

</script>
