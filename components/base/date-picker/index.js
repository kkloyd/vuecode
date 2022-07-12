import {DatePicker} from "element-ui"
import moment from "moment"

export default {
  name: "BaseDatePicker",
  props: {
    ...(typeof DatePicker === "function" ? DatePicker.options.props : DatePicker.props),
    specialType: {
      type: String,
      default: "",
    },
  },
  render: function (createElement) {
    if (this.$props.specialType == "grainbalance") {
      this.$props.pickerOptions = this.getBzOptions()
      this.$props.defaultValue = moment(this.$store.getters["Contexts/getContext"]("startDateOfGrainBalance")).format("YYYY-MM-DD")
    } else {
      this.$props.pickerOptions = this.getOptions()
      this.$props.defaultValue = moment().set({"year": this.$store.getters["Contexts/getYear"]}).startOf("year").format("YYYY-MM-DD")
    }
    this.$props.pickerOptions.firstDayOfWeek = 1
    const slots = Object.keys(this.$slots).reduce((arr, key) => arr.concat(this.$slots[key]), []);
    return createElement(DatePicker, {
      attrs: this.$attrs,
      props: this.$props,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      key: this.$vnode.key,
    }, slots)
  },
  methods: {
    getOptions() {
      return {
        disabledDate: (date) => {
          let from = moment().set({"year": this.$store.getters["Contexts/getYear"]}).startOf("year")
          let till = moment().set({"year": this.$store.getters["Contexts/getYear"]}).endOf("year")
          return !moment(date).isBetween(from, till, null, "[]")
        },
      }
    },
    getBzOptions() {
      return {
        disabledDate: (date) => {
          return !moment(date).isBetween(this.$store.getters["Contexts/getContext"]("startDateOfGrainBalance"), this.$store.getters["Contexts/getContext"]("endDateOfGrainBalance"), null, "[]")
        },
      }
    },
  },
}
