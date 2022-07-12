<template>
  <div class="container-upload">
    <div v-if="user.imageByte && !form.base" class="img-container">
      <img :src="user.imageByte">
    </div>
    <div v-if="form.base" class="img-container">
      <img :src="form.base">
    </div>
    <div class="upload-avatar">
      <input id="upload-ava" type="file" accept=".png, .jpg, .jpeg" @change="readFile()">
    </div>
    <el-button :loading="loading" type="primary" size="medium" @click="postAva()">
      Загрузить
    </el-button>
  </div>
</template>

<script>
import http from "@/services/http"
import Auth from "@/services/Auth"

export default {
  props: {
    "user": {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {
        base: null,
      },
      validation: {
        maxSize: 2097152,
        types: ["image/png", "image/jpeg", "image/jpg"],
      },
      loading: false
    }
  },
  methods: {
    postAva() {
      if (this.form.base) {
        let data = {
          id: this.user.id,
          imageByte: this.form.base
        }
        this.loading = true
        http.post("SaveUserImage", data).then(() => {
          this.refresh();
        }).catch(() => {
          this.loading = false
        });
      } else {
        this.$message({
          message: `Выберите аватар!`,
          type: "warning",
          duration: 1500,
          showClose: false,
        });
      }
    },
    readFile() {
      let file = document.getElementById("upload-ava")
      this.form.base = null
      if (this.validation.types.includes(file.files[0].type)) {
        if (file.files[0].size <= this.validation.maxSize) {
          this.refresh()
          let here = this
          var reader = new FileReader();
          reader.onload = function (event) {
            here.form.base = event.target.result
          };
          reader.readAsDataURL(file.files[0]);
        } else {
          this.$message({
            message: `Размер не должен превышать 1 мб`,
            type: "error",
            duration: 1500,
            showClose: false,
          });
          this.refresh()
        }
      } else {
        this.$message({
          message: `Недопустимый формат файла, выберите *.png/*.jpg`,
          type: "error",
          duration: 1500,
          showClose: false,
        });
        this.refresh()
      }

    },
    refresh() {
      this.form.base = null
      Auth.loadProfile()
      this.loading = false
    },
  }
}

</script>

<style lang="stylus" scoped>
.container-upload
  max-width 400px
  width calc(100%)
  padding 0

.img-container
  width 100%

  img
    max-width 150px
    max-height 150px

.upload-avatar
  width 100%
  margin-bottom 10px
</style>
