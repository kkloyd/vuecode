<template>
  <div id="mapTwo">
    <div v-loading="!mapReady" style="height: 100%; width: 100%;"/>
  </div>
</template>

<script>
import L from "leaflet"
import "leaflet-providers"
import "leaflet/dist/leaflet.css"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"
import http from "@/services/http";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default {
  name: "FieldMap",
  props: {
    "data": {
      type: Number,
      default: null,
    },
    "scouting": {
      type: Object,
      default: () => {},
    },
    imageUrl: {
      type: String,
      default: null
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      mapReady: false,
      dataReady: false,
      markerStatus: false,
      polygonsMarkersGroup: L.featureGroup(),
      markers: [],
      leftLayerUml: L.imageOverlay(),
      polygon: {},
    }
  },
  watch:{
    isVisible: {
      handler: function (val) {
        if(val){
          
          if (this.map) {
            this.polygonsMarkersGroup.clearLayers()
            this.mapReady = false
            this.drawMap()
          }
        }
      },
      immediate: true
    },
  },
  mounted() {
    this.mapReady = false
    this.drawMap()
  },
  beforeDestroy() {
    this.polygonsMarkersGroup.clearLayers();
    this.map.removeLayer(this.polygonsMarkersGroup);
    if (this.map && this.map.remove) {
      this.map.off();
      this.map.remove();
    }
  },
  methods: {
    drawMap() {
      if (this.map) {
        this.map.remove()
      }
      this.addLayers()
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
      }
      
      this.map = L.map("mapTwo", mapOptions).setView([53.2858, 69.4466], 12);
      L.control.layers(baseLayers, {}).addTo(this.map);
      this.addPolygon()
    },
    addPolygon() {
      http.get(`kml/GetParsedKml?orgId=${this.$store.getters["Contexts/getOrganization"]}&fieldId=${this.data}`)
        .then(
          data => {
            let latLng = JSON.parse(data)
            this.polygon = L.polygon(latLng, {color: "#000", fillColor: "rgba(140, 140, 140, 1)", weight: 1, fillOpacity: 0, className: ""})
            this.polygon.addTo(this.map)
            this.map.fitBounds(this.polygon.getBounds())
            this.setEvents()
            this.addImage()
     
          })
    },
    addImage() {
      
      let imageUrlLeft = this.imageUrl
      let imageBounds = [[this.polygon._bounds._northEast.lat, this.polygon._bounds._northEast.lng], [this.polygon._bounds._southWest.lat, this.polygon._bounds._southWest.lng]]
      L.imageOverlay(imageUrlLeft, imageBounds).addTo(this.map);
      this.mapReady = true
      this.showMarker()
    },

    setEvents() {
      this.map.on("click", (e) => {
        const buttonRemove = '<button type="button" class="remove">Убрать маркер</button>'
        let marker = new L.Marker(e.latlng, {
          draggable: true
        }).bindPopup(buttonRemove)
        this.polygonsMarkersGroup.addLayer(marker)
        this.polygonsMarkersGroup.addTo(this.map)

        marker.on("popupopen", removeMarker);
        let self = this

        function removeMarker() {
          const marker = this;
          const btn = document.querySelector(".remove")
          btn.addEventListener("click", function () {
            self.map.removeLayer(marker);
            self.scouting.pointsForSurvey = self.scouting.pointsForSurvey.filter(m => m.leaflet_id !== marker._leaflet_id)
          })
        }

        function dragedMaker() {
          const marker = this;
          for (let i = 0; i < self.scouting.pointsForSurvey.length; i++) {
            if (self.scouting.pointsForSurvey[i].leaflet_id === marker._leaflet_id) {
              self.scouting.pointsForSurvey[i].latitude = marker.getLatLng().lat
              self.scouting.pointsForSurvey[i].longitude = marker.getLatLng().lng
            }
          }
        }

        marker.on("dragend", dragedMaker);

        const {lat: latitude, lng: longitude} = marker.getLatLng()
        let coords = {
          latitude: latitude,
          longitude: longitude,
          leaflet_id: marker._leaflet_id
        }
        this.scouting.pointsForSurvey.push(coords)
      })
    },
    showMarker() {
      this.polygonsMarkersGroup.addTo(this.map)
      this.scouting.pointsForSurvey = this.scouting.pointsForSurvey ? this.scouting.pointsForSurvey : []
      const buttonRemove = '<button type="button" class="remove">Убрать маркер</button>'
      for (let i = 0; i < this.scouting.pointsForSurvey.length; i++) {
        let point = this.scouting.pointsForSurvey[i]
        let marker = new L.Marker({lat: point.latitude, lng: point.longitude}, {
          markerIndex: i,
          draggable: true
        }).bindPopup(buttonRemove)
        this.polygonsMarkersGroup.addLayer(marker)
        this.polygonsMarkersGroup.addTo(this.map)

        marker.on("popupopen", removeMarker);
        marker.on("dragend", dragedMaker);
        // this.markers.push(marker)
      }
      let self = this
      function removeMarker() {
        const marker = this;
        const btn = document.querySelector(".remove")
        btn.addEventListener("click", function () {
          self.map.removeLayer(marker);
          self.scouting.pointsForSurvey.splice(marker.options.markerIndex, 1)
        })
      }
      function dragedMaker() {
        const marker = this;
        self.scouting.pointsForSurvey[marker.options.markerIndex].latitude = marker.getLatLng().lat
        self.scouting.pointsForSurvey[marker.options.markerIndex].longitude = marker.getLatLng().lng
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#mapTwo
  height 400px
  max-width 500px
  box-sizing border-box
  z-index 4
  >>> .leaflet-icon
    font-size 16px
    color #000
</style>
