<template>
  <el-dialog :visible="visible" :before-close="handleClose" :close-on-click-modal="false" custom-class="el-dialog--tiny" title="Обратная связь">
    <el-form label-position="top" size="medium">
      <el-form-item label="Сообщение">
        <el-input v-model="feedback" type="textarea"/>
      </el-form-item>
      <el-button :disabled="!feedback" :loading="loadingItem.feedback" type="primary"
                 size="medium" @click="send(feedback)"
      >
        Отправить
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import http from "@/services/http"

export default {
  name: "Feedback",
  props: {
    "visible": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      feedback: "",
      loadingItem: {
        feedback: false,
      },
    }
  },
  methods: {
    send() {
      this.loadingItem.feedback = true
      let body = {message: this.feedback}
      http.post("feedback", body)
        .then(() => {
          this.loadingItem.feedback = false
          this.close()
        })
        .catch((e) => {
          this.loadingItem.feedback = false
          throw e
        })
    },
    close() {
      this.feedback = ""
      this.$emit("close")
    },
    handleClose(done) {
      this.close()
      done()
    }
  },
}
</script>
