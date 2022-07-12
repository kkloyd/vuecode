<template>
  <div>
    <div v-for="(item, indx) in syncData" :key="indx" class="sync-date-wrapper">
      <el-tooltip :content="item.text" effect="light">
        <div
          :style="{'background-color': item.color}"
          class="sync-date-status"
        />
      </el-tooltip>
      <el-tooltip :content="item.warehouseName" effect="light">
        <span>
          {{ item.lastArmSignal }}
        </span>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import http from "@/services/http";
import moment from "moment";

export default {
  name: "SyncIndicator",
  props: {
    warehouseIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      syncData: [],
    }
  },
  watch: {
    warehouseIds: {
      handler: function (val, oldVal) {
        if (val) {
          this.lastSync(val)
        }
      },
      immediate: true,
    }
  },

  methods: {
    lastSync(val) {
      let ids = this.syncData.map(i => i.warehouseId)
      let notFound = false
      val.forEach(i => {
        notFound = !ids.includes(i)
      })
      if (notFound) {
        this.getLastSync(val)
      } else {
        this.syncData = this.syncData.filter(i => val.includes(i.warehouseId))
      }
    },
    getLastSync(val) {
      if (val.length > 0) {
        let last = val
        http.post(`LastSyncDate`, this.warehouseIds)
          .then(response => {
            if (last === this.warehouseIds) {
              let syncData = response.map(i => {
                i.lastArmSignal = moment(i.lastArmSignal).format("DD.MM.YYYY HH:mm")
                let temp = this.setColor(i)
                i.color = temp.color
                i.text = temp.text
                return i
              })
              let arr = []
              this.warehouseIds.forEach(i => {
                let temp = syncData.find(o => o.warehouseId === i)
                if(temp) arr.push(temp)
              })
              this.syncData = arr
            }
          })
      } else {
        this.syncData = []
      }
    },
    setColor(val) {
      if (val) {
        let color
        let text
        const date = moment(val.lastArmSignal, "DD.MM.YYYY HH:mm")
        const current = moment()
        const duration = moment.duration(current.diff(date))
        const diff = duration.asHours()
        if (diff < 3) {
          color = "green"
          text = "Менее 3 часов"
        }
        else if (diff >= 3 && diff < 12) {
          color = "yellow"
          text = "Более 3 часов"
        }
        else if (diff >= 12) {
          color = "red"
          text = "Более 12 часов"
        }
        return {color, text}
      } else return {color: "", text: ""}
    }
  }

}
</script>

<style scoped>
.sync-date-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20px 0 0;
}
.sync-date-status {
  display: flex;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
