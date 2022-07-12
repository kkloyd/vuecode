<template>
  <svg v-if="visible" :class="svgClass" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle :cx="center" :cy="center" :r="radius" fill="none" :stroke="strokeColor1" :stroke-width="strokeWidth"/>
    <circle :class="svgCircleClass" :cx="center" :cy="center" :r="radius" fill="none" :stroke="strokeColor2" :stroke-width="strokeWidth"/>
    <text :transform="`rotate(90, ${center}, ${center})`" :x="center" :y="center" text-anchor="middle" fill="black" :font-size="fontSize" dy="0.33em">
      {{ timeLeft }}
    </text>
  </svg>
</template>

<script>
import {create} from "jss"
import preset from "jss-preset-default"

const jss = create(preset())
const sheet = jss.createStyleSheet({}, {link: true})

export default {
  name: "TimeoutCircle",
  props: {
    "value": {
      type: Number,
      default: 5,
    },
    "callback": {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      timeLeft: null,
      size: 32,
      strokeWidth: 3,
      strokeColor1: "#eef1f6",
      strokeColor2: "#409EFF",
      svgClass: "",
      svgCircleClass: "",
    }
  },
  computed: {
    center() {
      return this.size / 2
    },
    radius() {
      return (this.size / 2) - this.strokeWidth
    },
    fontSize() {
      return (this.size / 2) - this.strokeWidth
    },
  },
  watch: {
    value: {
      handler: function (val, oldVal) {
        if (val) {
          this.attachStyle()
          this.visible = true
          this.startTimer(val)
        } else {
          this.stopTimer()
          this.visible = false
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    sheet.detach()
    if (this.stopTimer) this.stopTimer()
  },
  methods: {
    attachStyle() {
      let duration = this.value
      const styles = {
        "@keyframes timeout-animation": {
          from: {
            "stroke-dashoffset": (2 * 3.14 * this.radius) * (0 / 360)
          },
          to: {
            "stroke-dashoffset": (2 * 3.14 * this.radius) * (360 / 360)
          }
        },
        timeout: {
          transform: "rotate(-90deg)",
        },
        timeout__value: {
          "animation-name": "$timeout-animation",
          "animation-duration": `${duration}s`,
          "animation-delay": "0s",
          "animation-timing-function": "linear",
          "animation-iteration-count": "infinite",
          "stroke-dasharray": 2 * 3.14 * this.radius,
          "stroke-dashoffset": (2 * 3.14 * this.radius) * (0 / 360),
        }
      }
      sheet.addRules(styles)
      sheet.attach()
      this.svgClass = sheet.classes.timeout
      this.svgCircleClass = sheet.classes.timeout__value
    },
    startTimer(val) {
      this.timeLeft = val
      let intervalId = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft <= 0) {
          this.stopTimer()
          this.callback()
        }
      }, 1000)
      this.stopTimer = () => clearInterval(intervalId)
    },
  },
}
</script>
