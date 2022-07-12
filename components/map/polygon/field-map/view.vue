<template>
  <div id="map">
    <div v-loading="!ready" style="height: 100%; width: 100%;"/>
  </div>
</template>

<script>

import http from "@/services/http"
import L from "leaflet"
import "leaflet-providers"
import "leaflet/dist/leaflet.css"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});
L.Marker.prototype.options.icon = DefaultIcon

export default {
  name: "FieldMap",
  props: {
    fieldId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      map: null,
      mapReady: false,
      dataReady: false,
      latLng: []
    }
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
  },
  mounted() {
    this.drawMap()
  },
  methods: {
    drawMap() {
      this.addLayers()
      this.addScale()
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
        layers: [googleHybrid],
        preferCanvas: false,
      }
      this.map = L.map("map", mapOptions).setView([53.2858, 69.4466], 12);
      L.control.layers(baseLayers, {}).addTo(this.map);
      this.mapReady = true
    },
    addScale() {
      L.control.scale({maxWidth: 240, metric: true, imperial: false, position: "bottomleft"}).addTo(this.map);
    },
    addPolygon() {
      http.get(`kml/GetParsedKml?orgId=${this.$store.getters["Contexts/getOrganization"]}&fieldId=${this.fieldId}`)
        .then(
          data => {
            this.latLng = JSON.parse(data)
            let polygon = L.polygon(this.latLng, {color: "#000", fillColor: "rgba(140, 140, 140, 1)", weight: 1, fillOpacity: 0.45, className: ""})
            polygon.addTo(this.map)
            this.map.fitBounds(polygon.getBounds())
          })
    },
  }
}
</script>

<style lang="stylus" scoped>
#map
  height inherit
  box-sizing border-box
  z-index 4
  >>> .leaflet-icon
    font-size 16px
    color #000
</style>
