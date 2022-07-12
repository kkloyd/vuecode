import moment from "moment"

export default {
  computed: {
    contextOrganization() {
      return this.$store.getters["Contexts/getOrganization"]
    },
    contextYear() {
      return this.$store.getters["Contexts/getYear"]
    },
  },
  watch: {
    contextOrganization: {
      handler: function () {
        localStorage.removeItem("warehouseIds")
      },
    },
    contextYear: {
      handler: function (val) {
        if (val) {
          // current year July 1
          let startDateOfGrainBalance = moment().set({"year": val, "month": 6}).startOf("month")
          this.$store.dispatch("Contexts/actionSetContext", {name: "startDateOfGrainBalance", val: startDateOfGrainBalance})
          // next year June 30
          let endDateOfGrainBalance = moment().set({"year": val + 1, "month": 5}).endOf("month")
          this.$store.dispatch("Contexts/actionSetContext", {name: "endDateOfGrainBalance", val: endDateOfGrainBalance})
        }
      },
    },
  },
}
