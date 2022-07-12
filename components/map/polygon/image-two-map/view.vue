<template>
  <div class="row">
    <div class="cols" id='mapLeft'></div>
    <div class="cols" id="mapRight"></div>
    <el-dialog
      :title="'Добавить маршрут'"
      :visible.sync="isDialogVisible"
      width="500px"
    >
      <el-form label-position="top" ref="scoutingFormLayout" :model="scoutingForm">
        <el-form-item label="Скаутер" prop="scouterId">
          <el-select
            v-model="scoutingForm.scouterId"
            placeholder="Выберите скаутера"
            filterable
          >
            <el-option v-for="s in scouters" :key="s.id" :label="s.fullName" :value="s.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Планируемый период обследования" prop="dateRange" style="margin-bottom: 30px">
          <el-date-picker v-model="scoutingForm.dateRange"
                          :editable="false"
                          :clearable="false"
                          unlink-panels
                          :picker-options="{disabledDate: disabledDate}"
                          type="daterange" format="dd.MM.yyyy" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <div class="map-container">
          <ScouterMap :data="fieldId" :scouting="scoutingForm" :image-url="clickedImageUrl"
                      :is-visible="isDialogVisible"/>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="closeModal">Отмена</el-button>
            <el-button type="primary" @click="saveScoutingForm(scoutingForm)">Добавить</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>
import L from "leaflet"
import "leaflet-providers"
import "leaflet/dist/leaflet.css"
import "leaflet-easybutton"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import http from "@/services/http";
import "@/lib/compare-images"
import {fetchEntities, fromVuex} from '@/services/entity-loader'
import ScouterMap from "./scouter-map"
import Auth from "@/services/Auth";
import {Message} from "element-ui"
import moment from 'moment'
import {library, dom} from "@fortawesome/fontawesome-svg-core";
import {faList} from "@fortawesome/free-solid-svg-icons/faList";

library.add(faList)
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default {
  name: "FieldMap",
  components: {
    ScouterMap
  },
  props: {
    fieldId: {
      type: Number,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    imageUrlRight: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      mapLeft: null,
      mapRight: null,
      mapReady: false,
      dataReady: false,
      isSaving: false,
      scouters: [],
      scoutingForm: {
        dateRange: [
          moment().set('year', this.$store.getters["Contexts/getYear"]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          moment().set('year', this.$store.getters["Contexts/getYear"]).endOf("day").format("YYYY-MM-DDTHH:mm:ss")
        ],
        scouterId: null,
        pointsForSurvey: []
      },
      markerStatus: false,
      polygonsMarkersGroup: L.featureGroup(),
      markers: [],
      leftImage: L.imageOverlay(),
      rightImage: L.imageOverlay(),
      latLng: [],
      polygonLeft: {},
      polygonRight: {},
      clickedImageUrl: null,
      isDialogVisible: false,
      colorsList: [
        {id: "zero", color: "rgb(255,67,0)", content: "Открытая почва", veg: 0},
        {id: "first", color: "rgb(255,102,0)", content: "Открытая почва", veg: 0.04},
        {id: "second", color: "rgb(255,135,0)", content: "Открытая почва", veg: 0.07},
        {id: "third", color: "rgb(255,170,0)", content: "Открытая почва", veg: 0.14},
        {id: "fourth", color: "rgb(255,204,0)", content: "Открытая почва", veg: 0.25},
        {id: "fivth", color: "rgb(255,237,0)", content: "Слабо разряженная растительность", veg: 0.35},
        {id: "sixth", color: "rgb(247,253,9)", content: "Слабо разряженная растительность", veg: 0.42},
        {id: "seventh", color: "rgb(232,251,28)", content: "Слабо разряженная растительность", veg: 0.49},
        {id: "eighth", color: "rgb(203,247,67)", content: "Слабо разряженная растительность", veg: 0.55},
        {id: "nineth", color: "rgb(188,244,86)", content: "Разряженная растительность", veg: 0.6},
        {id: "tenth", color: "rgb(144,207,99)", content: "Разряженная растительность", veg: 0.7},
        {id: "eleventh", color: "rgb(114,193,91)", content: "Разряженная растительность", veg: 0.8},
        {id: "twelveth", color: "rgb(85,178,82)", content: "Густая растительность", veg: 0.9},
        {id: "thirteenth", color: "rgb(55,164,73)", content: "Густая растительность", veg: 0.95},
        {id: "fourteenth", color: "rgb(26,150,65)", content: "Густая растительность", veg: 1},
        {id: "cloud", color: "rgb(212,212,212)", content: "Облако", veg: 'Ø'},
      ],
    }
  },
  watch: {
    fieldId: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.addPolygon()
          this.dataReady = {}
        }
      },
    },
    ready: {
      handler: function (val) {
        if (val) {
          this.addPolygon()
        }
      },
    },


    imageUrl(val) {
      this.addImage(val)
    },
    imageUrlRight(val) {
      this.addImage(val)
    },
  },
  created() {
    fetchEntities([
      "users",
    ], this.afterFetch)
  },
  mounted() {
    this.mapReady = false
    this.drawMap()
  },
  beforeDestroy() {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  },
  methods: {
    afterFetch() {
      this.scouters = fromVuex("users").filter(u => (u.userRoles.includes(2) || u.userRoles.includes(4) && !u.lockoutEnabled))
    },
    disabledDate(date) {
      return moment(date) < moment()
    },
    drawMap() {
      if (this.map) {
        this.map.remove()
      }
      this.addLayers()
    },
    addLayers() {
      let attribution = "Agrostream";
      let osmToLeft = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: attribution});
      let osmToRight = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: attribution});
      let satelliteToLeft = L.tileLayer.provider("Esri.WorldImagery", {attribution: attribution, maxZoom: 17});
      let satelliteToRight = L.tileLayer.provider("Esri.WorldImagery", {attribution: attribution, maxZoom: 17});
      const googleHybridToLeft = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });
      const googleHybridToRight = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });
      let baseLayers = {
        "Esri World Imagery": satelliteToLeft,
        "OpenStreetMaps": osmToLeft,
        "Google Hybrid": googleHybridToLeft
      };
      let secondLayer = {
        "Esri World Imagery": satelliteToRight,
        "OpenStreetMaps": osmToRight,
        "Google Hybrid": googleHybridToRight
      }
      let mapOptions = {
        layers: [satelliteToLeft],
        preferCanvas: false,
        zoomSnap: 0.25,
      }
      let mapOptionsTwo = {
        layers: [satelliteToRight],
        preferCanvas: false,
        zoomSnap: 0.25,
      }

      this.mapLeft = L.map("mapLeft", mapOptions).setView([53.2858, 69.4466], 12);
      this.mapRight = L.map("mapRight", mapOptionsTwo).setView([53.2858, 69.4466], 12);
      L.control.layers(baseLayers, {}).addTo(this.mapLeft);
      L.control.layers(secondLayer, {}).addTo(this.mapRight);
      this.mapLeft.sync(this.mapRight)
      this.mapRight.sync(this.mapLeft)
      this.addScautingToLeftMap()
      this.addScautingToRightMap()   
      this.setLegendToggleButton()
      this.addPolygon()
    },
    addScautingToLeftMap() {
      const context = this
      L.Control.AreaMeasure = L.Control.extend({
        options: {
          position: "topleft",
          active: false,
        },
        onAdd() {
          let container = L.DomUtil.create("div", "leaflet-control leaflet-bar")
          container.style.zIndex = 4
          container.style.display = "flex"
          let link = L.DomUtil.create("a", "el-icon-camera-solid", container)
          link.style.zIndex = 4
          link.href = "#"
          link.style.fontSize = "18px"
          link.style.fontWeight = "bold"
          link.title = "Добавить задание на скаутинг"
          L.DomEvent.on(link, "click", function () {
            context.clickedImageUrl = context.imageUrl
            context.isDialogVisible = true
          })

          return container
        },
      })
      L.control.areameasure = function () {
        return new L.Control.AreaMeasure()
      }
      L.control.areameasure().addTo(this.mapLeft)
    },
    addScautingToRightMap() {
      const context = this
      L.Control.AreaMeasure = L.Control.extend({
        options: {
          position: "topleft",
          active: false,
        },
        onAdd() {
          let container = L.DomUtil.create("div", "leaflet-control leaflet-bar")
          container.style.zIndex = 4
          container.style.display = "flex"
          let link = L.DomUtil.create("a", "el-icon-camera-solid", container)
          link.style.zIndex = 4
          link.href = "#"
          link.style.fontSize = "18px"
          link.style.fontWeight = "bold"
          link.title = "Добавить задание на скаутинг"
          L.DomEvent.on(link, "click", function () {
            context.clickedImageUrl = context.imageUrlRight
            context.isDialogVisible = true
          })

          return container
        },
      })
      L.control.areameasure = function () {
        return new L.Control.AreaMeasure()
      }
      L.control.areameasure().addTo(this.mapRight)
    },
    setLegendToggleButton() {
      this.legendToggleButton = L.easyButton({
        position: "bottomleft", type: "replace", leafletClasses: true,
        states: [
          {
            stateName: "show-sowings-legend",
            onClick: (control) => {
              this.addLegend()
              control.state("hide-sowings-legend")
            },
            title: "Показать легенду вегетации NDVI",
            icon: "fas fa-list"
          },
          {
            stateName: "hide-sowings-legend",
            onClick: (control) => {
              this.legend.remove()
              control.state("show-sowings-legend")
            },
            title: "Скрыть легенду вегетации NDVI",
            icon: "el-icon-close"
          },
        ]
      })
      console.log(this.legendToggleButton)
      this.legendToggleButton.addTo(this.mapLeft)
    },
    addLegend(){
      this.legend = L.control({position: "bottomleft"});
      this.legend.onAdd = () => {
        let container = L.DomUtil.create("div", "leaflet-control leaflet-bar")
        let div = L.DomUtil.create("div", "legend-color-info", container)
        this.colorsList.forEach(element => {
          div.innerHTML += `<el-col id="${element.id}" class="el-col-1 color-info-box" style="background: ${element.color};  
                              height :20px;  width: 20px" label="${element.content}"> <span class="color-info-tooltip">${element.veg}</span>
                            </el-col>`
        });
        div.innerHTML += `<div id="content-of-color"></div>`
        return div
      }
      this.legend.addTo(this.mapLeft)
      document.querySelectorAll(".color-info-box").forEach((c) => {
        c.addEventListener('click', () => {
          this.clickedColor(c)
        })
      })
    },
    addPolygon() {
      http.get(`kml/GetParsedKml?orgId=${this.$store.getters["Contexts/getOrganization"]}&fieldId=${this.fieldId}`)
        .then(data => {
          this.latLng = JSON.parse(data)
          if (this.polygonLeft) {
            this.mapLeft.removeLayer(this.polygonLeft)
            this.mapRight.removeLayer(this.polygonRight)
          }
          this.polygonLeft = L.polygon(this.latLng, {
            color: "#000",
            fillColor: "rgba(140, 140, 140, 1)",
            weight: 1,
            fillOpacity: 0,
            className: ""
          })
          this.polygonRight = L.polygon(this.latLng, {
            color: "#000",
            fillColor: "rgba(140, 140, 140, 1)",
            weight: 1,
            fillOpacity: 0,
            className: ""
          })
          this.polygonLeft.addTo(this.mapLeft)
          this.polygonRight.addTo(this.mapRight)
          // this.mapRight.fitBounds(this.polygon.getBounds())
          this.addImage()
        })
    },
    addImage() {
      if (this.leftImage._url) {
        this.leftImage.removeFrom(this.mapLeft)
      }
      if (this.rightImage._url) {
        this.rightImage.removeFrom(this.mapRight)
      }
      let imageBounds = [[this.polygonLeft._bounds._northEast.lat, this.polygonLeft._bounds._northEast.lng], [this.polygonLeft._bounds._southWest.lat, this.polygonLeft._bounds._southWest.lng]]
      this.leftImage = L.imageOverlay(this.imageUrl, imageBounds).addTo(this.mapLeft);
      this.rightImage = L.imageOverlay(this.imageUrlRight, imageBounds).addTo(this.mapRight);
      this.mapLeft.setView(this.polygonLeft.getBounds().getCenter(), 14);
      this.mapRight.setView(this.polygonRight.getBounds().getCenter(), 14);
      this.mapReady = true
    },
    saveScoutingForm(scouting) {
      this.isSaving = true
      let orgId = this.$store.getters["Contexts/getOrganization"]
      let body = {
        fieldId: this.$store.getters["Contexts/getField"],
        executorId: scouting.scouterId,
        appointerId: Auth.getProfile().id,
        startDate: scouting.dateRange[0],
        endDate: scouting.dateRange[1],
        pointsForSurvey: scouting.pointsForSurvey
      }
      http.post(`scouting/${orgId}/`, body).then(() => {
        Message({
          message: "Маршрут успешно сохранен!",
          type: "success",
          duration: 3000,
          isDialogVisible: true,
        })
      }).finally(() => this.isSaving = false,
        this.closeModal()
      )
    },
    closeModal() {
      this.scoutingForm.dateRange = [
        moment().set('year', this.$store.getters["Contexts/getYear"]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
        moment().set('year', this.$store.getters["Contexts/getYear"]).endOf("day").format("YYYY-MM-DDTHH:mm:ss")
      ],
        this.scoutingForm.pointsForSurvey = null
      this.scoutingForm.scouterId = null
      this.isDialogVisible = false
    },
    clickedColor(c){
      document.querySelectorAll(".color-info-box").forEach((el) =>{
        el.classList.remove('active')
      })
      c.classList.add('active')
      let content = this.colorsList.find(el => el.id === c.id).content
      let veg = this.colorsList.find(el => el.id === c.id).veg
      document.getElementById('content-of-color').innerHTML = `<br><b>${veg}</b> - ${content}`
    },
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
}

.cols {
  flex: 50%;
  height: 100vh;
}

#mapLeft {
  border-right: 1px solid white;
}

</style>
