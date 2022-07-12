<template>
  <div>
    <el-input v-model="maskValue" :size="size" @blur="blurInput"></el-input>
  </div>
</template>
<script>

export default {
  name: "BaseInputMask",
  props: {
    "val": {
      type: Number,
      default: 0,
    },
    "size": {
      type: String,
      default: "mini",
    }
  },
  computed: {
    maskValue: {
      get() {
        let value = ""
        let partValue = this.val
        while (partValue > 999) {
          let part = partValue % 1000 >= 100 ? (partValue % 1000) : ("000" + (partValue % 1000)).slice(-3)
          value = " " + part + value
          partValue = Math.floor(partValue / 1000)
        }
        if (partValue > 0 || this.val === 0) {
          value = partValue.toString() + value
        }
        return value
      },
      set(val) {
        val = val.split(" ").join("")
        let value = val ? parseInt(val) : 0
        this.$emit('update:val', value)
      }
    }
  },
  methods: {
    blurInput() {
      this.$emit('change')
    }
  }
}
</script>
