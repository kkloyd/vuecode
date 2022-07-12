<template>
  <el-dialog :visible="visible" :before-close="handleClose" :append-to-body="true" custom-class="el-dialog--scrollable el-dialog--large" title="Просев" top="50px">
    <div>
      <div v-if="image" class="img-viewer-container">
        <div v-viewer="{zIndex: 20000}" >
          <img :src="image">
        </div>
      </div>
      <div class="el-table-cont">
        <el-table v-loading="loading" :data="assignments" max-height="177" class="content" border resizable size="mini">
          <el-table-column prop="assignemtId" label="#" width="90"/>
          <el-table-column label="Цвет" width="50">
            <template slot-scope="scope">
              <div :style="{backgroundColor: scope.row.color, height: '5px'}"/>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="Старт" width="90"/>
          <el-table-column prop="endDate" label="Завершение" width="90"/>
          <el-table-column prop="processedSquare" label="Площадь" width="90"/>
          <el-table-column prop="percentage" label="%" width="90"/>
          <el-table-column prop="employeeName" label="Водитель"/>
          <el-table-column prop="carName" label="Машина"/>
          <el-table-column prop="instrumentName" label="Орудие"/>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import http from "@/services/http"
import moment from "moment"

import 'viewerjs/dist/viewer.css'
import Viewer from "v-viewer"
import Vue from "vue"
Vue.use(Viewer)

export default {
  name: "TrackImage",
  props: {
    "assignmentId": {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      image: "",
      assignments: [],
      visible: false,
      loading: false,
    };
  },
  watch: {
    assignmentId: {
      handler: function (val) {
        if (val) {
          this.showImage(val)
        }
        this.visible = !!val
      },
    },
  },
  methods: {
    showImage(id) {
      this.loading = true
      http.getCache(`trackImage/${this.$store.getters["Contexts/getOrganization"]}/${id}`)
        .then(data => {
          this.setData(data)
        })
        .catch((e) => {
          this.setData()
          throw e
        })
        .finally(() => {
          this.loading = false
        })
    },
    setData(data = {}) {
      let image = "", assignments = []
      if (data && data.area !== 0 && data.remainedArea !== 0) {
        image = "data:image/jpg;base64," + data.image
        assignments = data.assignments.reverse().map(item => {
          item.startDate = moment(item.start, "YYYY-MM-DDTHH:mm:ss").format("DD.MM.YYYY HH:mm");
          item.endDate = moment(item.end, "YYYY-MM-DDTHH:mm:ss").format("DD.MM.YYYY HH:mm");
          return item
        })
      }
      this.image = image
      this.assignments = assignments
    },
    handleClose(done) {
      this.$emit("close")
      done()
    }
  },
}
</script>

<style lang="stylus" scoped>
 .img-viewer-container {
   display flex
   justify-content center
 }

 img {
    height: 250px;
    cursor: pointer;
    margin-bottom: 20px;
    display: inline-block;
  }
</style>
