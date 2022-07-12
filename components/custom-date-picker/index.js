import {DatePicker} from "element-ui"


// just el-date-picker but with starting day of week - Monday
export default {
  name: "ElDatePicker",
  props: {
    ...(typeof DatePicker === "function" ? DatePicker.options.props : DatePicker.props)
  },
  render: function (createElement) {
    this.$props.pickerOptions = {
      ...(this.$attrs && this.$attrs["picker-options"]),
      firstDayOfWeek: 1
    }
    const slots = Object.keys(this.$slots).reduce((arr, key) => arr.concat(this.$slots[key]), []);
    return createElement(DatePicker, {
      attrs: this.$attrs,
      props: this.$props,
      on: this.$listeners,
      scopedSlots: this.$scopedSlots,
      key: this.$vnode.key,
    }, slots)
  },
  methods: {},
}
