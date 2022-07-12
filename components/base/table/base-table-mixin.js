import TablePopoverMixin from "./table-popover-mixin"
import paginate from "@/filters/paginate"

export default {
  filters: {
    paginate,
  },
  mixins: [
    TablePopoverMixin,
  ],
  data() {
    return {
      page: {
        current: 1,
        size: 5,
        total: null,
      },
    }
  },
}
