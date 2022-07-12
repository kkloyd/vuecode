import FarmRoutes from "@/routes/farm/routes"
import ElevatorRoutes from "@/routes/elevator/routes"
import GroupRoutes from "@/routes/group/routes"
import UniversalRoutes from "@/routes/universal/routes"

export default {
  computed: {
    organizationType() {
      return this.$store.getters["App/getOrganizationType"]
    },
  },
  watch: {
    organizationType: {
      handler: function (val) {
        let routes = [FarmRoutes, ElevatorRoutes, GroupRoutes, UniversalRoutes][val]
        this.$router.addRoutes(routes)
      },
    },
  },
}
