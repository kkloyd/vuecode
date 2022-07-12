<template>
  <div id="map">
    <el-dialog
      :title="'Добавить маршрут'"
      :visible.sync="isDialogVisible"
      width="500px"
      margin-top="100px"
    >
      <el-form label-position="top" ref="scoutingFormLayout"  :model="scoutingForm">
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
                          type="daterange" format="dd.MM.yyyy" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <div class="map-container">
          <FieldMap :data="fieldId" :scouting="scoutingForm" :image-url="imageUrl" :is-visible="isDialogVisible"/>
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

import http from "@/services/http"
import L from "leaflet"
import "leaflet-providers"
import "leaflet/dist/leaflet.css"
import "leaflet-easybutton"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import FieldMap from "./field-map"
import {fetchEntities, fromVuex} from '@/services/entity-loader'
import "@/lib/leaflet-side-by-side.min"
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
L.Marker.prototype.options.icon = DefaultIcon

export default {
  name: "ImageMap",
  components: {
    FieldMap,
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
      map: null,
      mapReady: false,
      dataReady: false,
      isSaving: false,
      scouters: [],
      scoutingForm :{
        dateRange: [
          moment().set('year', this.$store.getters["Contexts/getYear"]).startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          moment().set('year', this.$store.getters["Contexts/getYear"]).endOf("day").format("YYYY-MM-DDTHH:mm:ss")
          ],
        scouterId: null,
        pointsForSurvey: []
      },
      isDialogVisible: false,
      leftLayerUml: L.imageOverlay(),
      rightLayerUml: L.imageOverlay(),
      sideBySide: L.control.sideBySide(),
      latLng: [],
      polygon: {},
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
  created(){
    fetchEntities([
      "users",
    ], this.afterFetch)
  },
  computed: {
    ready() {
      return this.mapReady && this.dataReady
    }
  },
  watch: {
    fieldId: {
      immediate: true,
      handler: function (val, oldVal) {
        if (val !== oldVal) this.dataReady = {}
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
  mounted() {
    this.drawMap()
  },
  methods: {
    afterFetch() {
      this.scouters = fromVuex("users").filter(u => (u.userRoles.includes(2) || u.userRoles.includes(4) && !u.lockoutEnabled))
    },

    drawMap() {
      this.addLayers()
      this.addScale()
      this.addScauting()
      this.setLegendToggleButton()
    },
    addLayers() {
      let attribution = "Agrostream";
      let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: attribution});
      let satellite = L.tileLayer.provider("Esri.WorldImagery", {attribution: attribution, maxZoom: 17});
      const googleHybrid = L.tileLayer("http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"]
      });
      let baseLayers = {"Esri World Imagery": satellite, "OpenStreetMaps": osm, "Google Hybrid": googleHybrid};
      let mapOptions = {
        layers: [satellite],
        preferCanvas: false,
        zoomSnap: 0.1,
        zoomAnimation: true,
      }
      this.map = L.map("map", mapOptions).setView([53.2858, 69.4466], 12);
      // L.control.sideBySide(osm, satellite).addTo(this.map);
      L.control.layers(baseLayers, {}).addTo(this.map);
      this.mapReady = true
    },
    addScale() {
      L.control.scale({maxWidth: 240, metric: true, imperial: false, position: "bottomleft"}).addTo(this.map);
    },
    addScauting(){   
      const context = this
      L.Control.AreaMeasure = L.Control.extend({
        options: {
          position: "topleft",
          active: false,
        },
        onAdd() {
          let container = L.DomUtil.create("div", "leaflet-control leaflet-bar")
          container.style.zIndex =  4
          container.style.display = "flex"
          let link = L.DomUtil.create("a", "el-icon-camera-solid", container)
          link.style.zIndex = 4
          link.href = "#"
          link.style.fontSize = "18px"
          link.style.fontWeight = "bold"
          link.title = "Добавить задание на скаутинг"
          L.DomEvent.on(link, "click", function () {
            FieldMap._compiled = false
            context.isDialogVisible = true
          })

          return container
        },
      })
      L.control.areameasure = function () {
        return new L.Control.AreaMeasure()
      }
      L.control.areameasure().addTo(this.map)
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
      this.legendToggleButton.addTo(this.map)
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
      this.legend.addTo(this.map)
      document.querySelectorAll(".color-info-box").forEach((c) => {
        c.addEventListener('click', () => {
          this.clickedColor(c)
        })
      })
    },
    addPolygon() {
      http.get(`kml/GetParsedKml?orgId=${this.$store.getters["Contexts/getOrganization"]}&fieldId=${this.fieldId}`)
        .then(data => {
          this.map.removeLayer(this.polygon)
          this.latLng = JSON.parse(data)
          this.polygon = L.polygon(this.latLng, {color: "#000", fillColor: "rgba(140, 140, 140, 1)", weight: 1, fillOpacity: 0, className: ""})
          this.polygon.addTo(this.map)
          this.map.fitBounds(this.polygon.getBounds())
          this.addImage()
        })
    },
    addImage() {
      if (this.leftLayerUml) {
        this.map.removeControl(this.sideBySide)
        this.map.removeLayer(this.leftLayerUml)
      }
      this.leftLayerUml.removeFrom(this.map)
      this.rightLayerUml.removeFrom(this.map)
      let imageUrlLeft = this.imageUrl
      let imageUrlRight = this.imageUrlRight;
      let imageBounds = [[this.polygon._bounds._northEast.lat, this.polygon._bounds._northEast.lng], [this.polygon._bounds._southWest.lat, this.polygon._bounds._southWest.lng]]
      this.map.createPane('left');
      this.map.createPane('right');
      this.leftLayerUml = L.imageOverlay(imageUrlLeft, imageBounds, {opacity: 1, pane: "left"}).addTo(this.map);
      this.rightLayerUml = L.imageOverlay(imageUrlRight, imageBounds, {opacity: 1, pane: "right"}).addTo(this.map);
      this.sideBySide = L.control.sideBySide(this.leftLayerUml, this.rightLayerUml);
      this.sideBySide.addTo(this.map);
      this.map.setView(this.polygon.getBounds().getCenter(), 14, {
        "animate": true,
        "pan": {
          "duration": 0
        }
      });
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
      }).finally(() =>  this.isSaving = false,
                        this.closeModal()                     
      )
    },
    closeModal(){
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

<style lang="stylus" scoped>
#map
  height 100%
  width 100%
  box-sizing border-box
  >>> .leaflet-icon
    font-size 16px
    color #000   
</style>
<style lang="stylus">
.color-info-box:hover 
  opacity 0.7
  cursor pointer
.color-info-box:hover .color-info-tooltip
  visibility visible

.color-info-box:after 
  content ""
  clear both
  display table
.color-info-box.active
  border 1px solid #74b9ff
  outline-color #74b9ff
  outline-style groove
  outline-width thin
.legend-color-info
  width 320px
  padding 6px 8px
  background #fff
  position absolute
  bottom 70px !important
.color-info-tooltip
  visibility hidden
  display inline-block
  font-size 10px
  width 20px
  background-color black
  color #fff
  text-align center
  border-radius 1px
  padding 5px 3px
  position relative
  left -3px
  bottom 27px
  z-index 1
</style>