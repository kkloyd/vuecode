import {store} from "@/store"
import {TableColumn} from "element-ui"

export default {
  name: "BaseTableColumn",
  props: {
    ...(typeof TableColumn === "function" ? TableColumn.options.props : TableColumn.props),
    defaultVisible: {
      type: [Boolean, String],
      default: true,
    },
    visible: {
      type: Boolean,
      default: function () {
        return store.getters["Columns/getColumnValue"](this._uid)
      },
    }
  },
  render: function (createElement) {
    let parent
    if (this.$props.label) {
      parent = this.getParent(["base-table-column", "el-table"])
      let table = this.getParent(["el-table"])
      store.dispatch("Columns/actionSetColumn", {
        id: this._uid,
        label: this.$props.label,
        parentId: parent._uid,
        tableId: table._uid,
        defaultValue: this.$props.defaultVisible,
      })
    }
    const slots = Object.keys(this.$slots).reduce((arr, key) => arr.concat(this.$slots[key]), []);
    if (this.$props.label || this.$props.prop) {
      let visible = store.getters["Columns/getColumnValue"](this._uid)
      if (visible) {
        store.dispatch("JSSSheetsManager/actionDetach", {id: this._uid})
      } else {
        if (parent.$vnode.componentOptions.tag == "el-table") {
          let styles = this.getStyleSheet(this, {})
          store.dispatch("JSSSheetsManager/actionAttach", {id: this._uid, styles})
        }
      }

      return createElement(TableColumn, {
        attrs: this.$attrs,
        props: {
          ...this.$props,
          visible: visible,
          width: visible ? this.$props.width : 1,
          label: visible ? this.$props.label : "",
          className: visible ? (this.$props.className ? this.$props.className : "") : "table-column--invisible",
          labelClassName: visible ? "" : "table-column--invisible",
        },
        on: this.$listeners,
        scopedSlots: this.$scopedSlots,
        key: this.$vnode.key,
      }, slots)
    } else {
      return createElement(TableColumn, {
        attrs: this.$attrs,
        props: this.$props,
        on: this.$listeners,
        scopedSlots: this.$scopedSlots,
        key: this.$vnode.key,
      }, slots)
    }
  },
  beforeDestroy() {
    store.dispatch("JSSSheetsManager/actionDetach", {id: this._uid})
  },
  methods: {
    getParent(tags) {
      let parent = ((el) => {
        while (!tags.includes(el.$parent.$vnode.componentOptions.tag)) {
          el = el.$parent
        }
        return el.$parent
      })(this)
      return parent
    },
    getStyleSheet(parent, styles) {
      parent.$children.forEach(child => {
        if (child.columnId) {
          styles[`col[name="${child.columnId}"]`] = {width: 0}
        }
        this.getStyleSheet(child, styles)
      })
      return styles
    },
  },
}
