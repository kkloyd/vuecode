import dateFilter from "@/filters/date-filter"
import {create} from "jss"
import preset from "jss-preset-default"

const jss = create(preset())
const sheet = jss.createStyleSheet({}, {link: true})

export default {
  data() {
    return {
      popoverContent: "",
      popoverVisible: false,
      popoverClass: "",
      popoverRef: "",
    }
  },
  props: {
    customPopover: {
      type: String,
      default: null
    },
  },
  beforeDestroy() {
    sheet.detach()
  },
  methods: {
    resetPopover() {
      this.popoverVisible = false
      this.popoverContent = ""
    },
    handleRowClick(row, column, event) {
      this.$emit("row-click", row, column, event)
      this.popoverRef = "popover"
      if (column && !column.label) {
        this.resetPopover()
      } else {
        let content = this.getPopoverContent(row)
        if (content) {
          this.popoverContent = content
          this.popoverVisible = true
          this.createPopoverClass(event)
        }
      }
      this.popoverRef = ""
    },
    getPopoverContent(row) {
      let datePrefix = row.dateModified
        ? (row.dateModified === row.dateCreated ? "Создано" : "Изменено")
        : (row.dateModified || row.dateCreated ? "Создано" : "")
      if (row.modifiedBy === "00000000-0000-0000-0000-000000000000") {
        datePrefix += datePrefix ? " системой" : "Создано системой"
      }
      let dateModified = row.dateModified ? dateFilter(row.dateModified, "YYYY-MM-DDTHH:mm:ss", "DD.MM.YYYY HH:mm") : ""
      let dateCreated = row.dateCreated ? dateFilter(row.dateCreated, "YYYY-MM-DDTHH:mm:ss", "DD.MM.YYYY HH:mm") : ""
      let date = dateModified || dateCreated
      let author = row.modifiedByName
      let fromMobile = row.fromMobile ? "Создано с мп" : ""
      let content = [datePrefix, date, author, fromMobile].join("\n")
      return content.trim()
    },
    createPopoverClass(event) {
      this.$nextTick(() => {
        let name = "popoverClass"
        let options = {className: "popoverClass"}
        let left = event.clientX
        let top = event.clientY
        let style = {position: "fixed", left: `${left}px !important`, top: `${top}px !important`, whiteSpace: "pre-line"}
        sheet.deleteRule(name)
        sheet.addRule(name, style, options)
        sheet.detach()
        sheet.attach()
        let className = sheet.getRule(name).selectorText.slice(1)
        this.popoverClass = className
      })
    },
  },
}
