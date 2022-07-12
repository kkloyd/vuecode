<template>
  <el-dialog :visible="visible" :before-close="handleClose" :close-on-click-modal="false" custom-class="el-dialog--scrollable el-dialog--tiny" title="Профиль" top="50px">
    <el-form label-position="top" size="medium">
      <el-form-item label="Аватар">
        <avatar :user="user"/>
      </el-form-item>
      <el-form-item label="Логин">
        <el-input v-model="user.userName" type="text" readonly/>
      </el-form-item>
      <el-form-item label="ФИО">
        <el-input v-model="user.fullName" type="text"/>
      </el-form-item>
      <el-form-item label="Организация">
        <el-select v-model="user.organizationId" class="form-item-iterable" placeholder="Организация" filterable>
          <el-option v-for="organization in organizations" :key="organization.id" :label="organization.name" :value="organization.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Должность">
        <el-input v-model="user.position" type="text"/>
      </el-form-item>
      <el-form-item label="Телефон">
        <el-input v-model.trim="user.phoneNumber" type="text" @input="isNumber"/>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model.trim="user.email" type="text"/>
      </el-form-item>
      <el-input v-model="user.userName" type="hidden" name="username" autocomplete="username"/>
      <el-form-item>
        <span :class="[changePasswordVisible ? 'dashGray' : 'dash']" @click="changePasswordVisible = !changePasswordVisible">
          Сменить пароль
        </span>
      </el-form-item>
    </el-form>
    <template v-if="changePasswordVisible">
      <el-form ref="passwordForm" :model="passwords" :rules="passwordFormRules" label-position="top" size="medium">
        <el-form-item class="form-item" label="Текущий пароль" prop="old">
          <el-input v-model="passwords.old" :type="passwordForm.old.type"
                    name="password" autocomplete="current-password"
          >
            <i slot="suffix" :class="passwordForm.old.icon" @click="togglePasswordOldView"/>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item" label="Новый пароль" prop="new">
          <el-input v-model="passwords.new" :type="passwordForm.new.type"
                    name="new-password" autocomplete="new-password"
          >
            <i slot="suffix" :class="passwordForm.new.icon" @click="togglePasswordNewView"/>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item" label="Подтверждение нового пароля" prop="confirm">
          <el-input v-model="passwords.confirm" :type="passwordForm.confirm.type"
                    name="confirm-password" autocomplete="new-password"
          >
            <i slot="suffix" :class="passwordForm.confirm.icon" @click="togglePasswordConfirmView"/>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <el-button :loading="loadingItem.save" type="primary" size="medium" @click="submit()">
      Сохранить
    </el-button>
  </el-dialog>
</template>
<script>
import {fromVuex} from "@/services/entity-loader"
import Auth from "@/services/Auth"
import avatar from "@/components/avatar"
import {deepClone} from "@/lib/utils"

import {library, dom, config} from "@fortawesome/fontawesome-svg-core"
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye"
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons/faEyeSlash"

library.add(faEye)
library.add(faEyeSlash)
config.autoReplaceSvg = "nest"
dom.watch()

export default {
  name: "UserProfile",
  components: {
    avatar,
  },
  props: {
    "visible": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("пожалуйста введите новый пароль"));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error("от 6 до 20 символов"));
      } else if (!(/[a-z0-9]/i).test(value)) {
        callback(new Error("должны содержаться только латинские буквы и цифры"));
      } else if (!(/[a-z]/).test(value)) {
        callback(new Error("должна содержаться хотя бы одна буква a-z"));
      } else if (!(/[A-Z]/).test(value)) {
        callback(new Error("должна содержаться хотя бы одна заглавная буква A-Z"));
      } else {
        if (this.passwords.new !== "") {
          this.$refs.passwordForm.validateField("confirm");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("пожалуйста введите новый пароль снова"));
      } else if (value !== this.passwords.new) {
        callback(new Error("новые пароли разнятся"));
      } else {
        callback();
      }
    };
    return {
      organizations: [],
      user: {},
      userClone: {},
      changePasswordVisible: false,
      loadingItem: {
        save: false,
      },
      passwordForm: {
        old: {icon: "fas fa-eye-slash", type: "password"},
        new: {icon: "fas fa-eye-slash", type: "password"},
        confirm: {icon: "fas fa-eye-slash", type: "password"},
      },
      passwords: {
        old: "",
        new: "",
        confirm: "",
      },
      passwordFormRules: {
        old: [
          {required: true, message: "Введите текущий пароль"},
        ],
        new: [
          {required: true, validator: validatePass},
        ],
        confirm: [
          {required: true, validator: validatePass2},
        ],
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.organizations = fromVuex("userorganizations");
      this.user = deepClone(Auth.getProfile())
      this.userClone = deepClone(this.user)
    },
    submit() {
      this.loadingItem.save = true
      if (this.isModified()) {
        this.saveProfile()
      } else {
        this.changePassword()
      }
    },
    isNumber() {
      this.user.phoneNumber = this.user.phoneNumber.replace(/[^0-9]/g, '');
    },
    isModified() {
      let keys = ["fullName", "organizationId", "position", "phoneNumber", "email"]
      return keys.some(key => {
        return this.user[key] !== this.userClone[key]
      })
    },
    saveProfile() {
      Auth.saveProfile(this.user)
        .then(() => {
          this.loadProfile()
        })
        .catch((e) => {
          throw e
        })
        .finally(() => {
          this.loadingItem.save = false
        })
    },
    loadProfile() {
      Auth.loadProfile()
        .then(profile => {
          this.showMsg("Профиль обновлен")
          this.changePassword()
        })
    },
    changePassword() {
      if (this.changePasswordVisible) {
        this.$refs["passwordForm"].validate((valid) => {
          if (valid) {
            Auth.changePassword(this.user.username, this.passwords)
              .then(() => {
                this.changePasswordVisible = false
                this.reset()
                this.close()
                this.showMsg("Пароль обновлен")
              })
              .catch(error => {
                this.showMsg("Проверьте правильность паролей", "error")
              })
              .finally(() => {
                this.loadingItem.save = false
              })
          } else {
            this.loadingItem.save = false
          }
        })
      } else {
        this.loadingItem.save = false
        this.close()
      }
    },
    showMsg(msg, type = "success") {
      this.$message({message: msg, type: type, duration: 5000, showClose: false});
    },
    togglePasswordOldView() {
      this.passwordForm.old.type = this.passwordForm.old.type == "password" ? "text" : "password"
      this.passwordForm.old.icon = this.passwordForm.old.icon == "fas fa-eye-slash" ? "fas fa-eye" : "fas fa-eye-slash"
    },
    togglePasswordNewView() {
      this.passwordForm.new.type = this.passwordForm.new.type == "password" ? "text" : "password"
      this.passwordForm.new.icon = this.passwordForm.new.icon == "fas fa-eye-slash" ? "fas fa-eye" : "fas fa-eye-slash"
    },
    togglePasswordConfirmView() {
      this.passwordForm.confirm.type = this.passwordForm.confirm.type == "password" ? "text" : "password"
      this.passwordForm.confirm.icon = this.passwordForm.confirm.icon == "fas fa-eye-slash" ? "fas fa-eye" : "fas fa-eye-slash"
    },
    reset() {
      this.$refs["passwordForm"].resetFields();
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
.form-item-iterable
  width 100%
  max-width 100%
.dash
  text-decoration none
  border-bottom 1px dashed #20a0ff
  color #20a0ff
  cursor pointer
  &:hover
    border-bottom-color rgba(#20a0ff, .5)
.dashGray
  text-decoration none
  border-bottom 1px dashed #666
  color #666
  cursor pointer
  &:hover
    border-bottom-color rgba(#666, .5)
</style>
