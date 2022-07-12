export default {
  mounted() {
    this.$nextTick(function () {
      window.addEventListener("resize", this.$_setWindowInnerHeight);
      this.$_setWindowInnerHeight()
    })
  },
  methods: {
    $_setWindowInnerHeight() {
      this.$store.dispatch("WindowResize/actionSetHeight", window.innerHeight)
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_setWindowInnerHeight);
  }
}
