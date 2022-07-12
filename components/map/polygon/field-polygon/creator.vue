<template>
  <div>
    <div v-if="newPolygon" class="selected-layer-area">
      <el-tag color="#000">
        {{ getArea(newPolygon) }} га
      </el-tag>
    </div>
  </div>
</template>

<script>
import L from "leaflet"
import "leaflet-easybutton"
import tokml from "tokml"
import "leaflet-editable"
import {calcPolygonArea} from "@/components/map/polygon/area"

const FIELD_POLYGON_CREATOR = "FIELD_POLYGON_CREATOR"


export default {
  name: "FieldPolygonCreator",
  props: {
    "map": {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      postNewBtns: null,
      newPolygon: null,
      newPolygonControl: null,
    }
  },
  created() {
    this.init()
    this.addNewPolygonControl()
  },
  beforeDestroy() {
    this.removePostNewBtns()
    this.removeNewPolygon()
    this.removeEditToolsEvents()
    this.removeNewPolygonControl()
  },
  methods: {
    init() {
      this.initNewPolygonControl()
      this.initEditToolsEvents()
      this.initPostNewBtns()
    },
    initNewPolygonControl() {
      let that = this
      L.NewPolygonControl = L.Control.extend({
        options: {
          position: "topleft"
        },
        onAdd: function (map) {
          var container = L.DomUtil.create("div", "leaflet-control leaflet-bar"),
            link = L.DomUtil.create("a", "", container);
          link.href = "#";
          link.title = "Создать новый полигон";
          link.innerHTML = "▱";
          link.id = "leaflet-new-polygon-btn"
          L.DomEvent.on(link, "click", L.DomEvent.stop)
            .on(link, "click", function () {
              that.$emit("polygon-click")
              const e = map.editTools.startPolygon();
              e.customId = FIELD_POLYGON_CREATOR
            });
          container.style.display = "block";
          map.editTools.on("editable:enabled", function (e) {
            if (e.target && e.target.currentPolygon
              && e.target.currentPolygon.customId === FIELD_POLYGON_CREATOR)
              container.style.display = "none";
          });
          map.editTools.on("editable:disable", function (e) {
            if (e.layer && e.layer.customId && e.layer.customId === FIELD_POLYGON_CREATOR)
              container.style.display = "block";
          });
          return container;
        }
      });
      this.addNewPolygonControl = () => {
        if (this.newPolygonControl) this.map.removeControl(this.newPolygonControl)
        this.newPolygonControl = new L.NewPolygonControl()
        this.map.addControl(this.newPolygonControl);
      }
      this.removeNewPolygonControl = () => {
        if (this.newPolygonControl) this.map.removeControl(this.newPolygonControl)
      }
    },
    initEditToolsEvents() {
      let that = this
      let func1 = function (e) {
        setTimeout(() => {
          if (e.layer.customId && e.layer.customId === FIELD_POLYGON_CREATOR) {
            that.addPostNewBtns()
            that.$store.dispatch("Map/actionSetEditState", true)
            that.newPolygon = e.layer
            if (this.currentPolygon) this.currentPolygon.disableEdit();
            this.currentPolygon = e.layer;
            this.currentPolygon.on("click", function (e) {
              if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
                this.editor.newHole(e.latlng)
              }
            })
            this.fire("editable:enabled");
          }
        })
      }
      let func2 = function (e) {
        if (e.layer.customId && e.layer.customId === FIELD_POLYGON_CREATOR)
          that.newPolygon = e.layer
      }
      let func3 = function (e) {
        if (e.layer.customId && e.layer.customId === FIELD_POLYGON_CREATOR)
          delete this.currentPolygon;
      }
      this.map.editTools.on("editable:created", func1)
      this.map.editTools.on("editable:editing", func2)
      this.map.editTools.on("editable:disable", func3)
      this.removeEditToolsEvents = () => {
        this.map.editTools.off("editable:created", func1)
        this.map.editTools.off("editable:editing", func2)
        this.map.editTools.off("editable:disable", func3)
      }
    },
    initPostNewBtns() {
      let saveBtn = this.getSaveBtn()
      let cancelBtn = this.getCancelBtn()
      this.postNewBtns = L.easyBar([cancelBtn, saveBtn])
      this.addPostNewBtns = () => {
        this.postNewBtns.addTo(this.map)
      }
      this.removePostNewBtns = () => {
        if (this.postNewBtns) this.postNewBtns.remove()
      }
    },
    getSaveBtn() {
      let saveBtn = L.easyButton({
        id: "leaflet-save-new-polygon-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [
          {
            stateName: "save", title: "Сохранить", icon: "el-icon-check",
            onClick: () => {
              this.removePostNewBtns()
              this.newPolygon.disableEdit()
              this.save()
              this.$store.dispatch("Map/actionSetEditState", false)
            },
          }
        ]
      })
      return saveBtn
    },
    getCancelBtn() {
      let cancelBtn = L.easyButton({
        id: "leaflet-cancel-new-polygon-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{
          stateName: "cancel", title: "Отменить", icon: "el-icon-close",
          onClick: () => {
            this.removePostNewBtns()
            this.newPolygon.disableEdit()
            this.removeNewPolygon()
            this.$emit("cancel")
            this.$store.dispatch("Map/actionSetEditState", false)
          }
        }]
      })
      return cancelBtn
    },
    save() {
      try {
        let body = {
          kml: tokml(this.newPolygon.toGeoJSON()),
          fieldId: null,
          kmlArea: this.getArea(this.newPolygon),
        }
        this.removeNewPolygon()
        this.$emit("save", body)
      } catch (e) {
        this.$emit("cancel")
      }
    },
    removeNewPolygon() {
      if (this.newPolygon) this.map.removeLayer(this.newPolygon)
    },
    getArea(polygon) {
      return calcPolygonArea(polygon)
    },
  }
}
</script>
<style lang="stylus" scoped>
.selected-layer-area
  position absolute
  left 50px
  top 117px
  z-index 4
</style>
