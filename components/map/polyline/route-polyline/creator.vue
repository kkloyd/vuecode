<template>
  <div/>
</template>

<script>
import L from "leaflet"
import "leaflet-easybutton"
import tokml from "tokml"
import "leaflet-editable"

const ROUTE_POLYLINE_CREATOR = "ROUTE_POLYLINE_CREATOR"

export default {
  name: "RoutePolylineCreator",
  props: {
    "map": {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      postNewBtns: null,
      newPolyline: null,
      newPolylineControl: null,
    }
  },
  computed: {
    selectedPath() {
      return this.$store.getters["Map/Routes/getSelectedPath"]
    },
  },
  created() {
    this.init()
    this.addNewPolylineControl()
  },
  beforeDestroy() {
    this.removePostNewBtns()
    this.removeNewPolyline()
    this.removeEditToolsEvents()
    this.removeNewPolylineControl()
  },
  methods: {
    init() {
      this.initNewPolylineControl()
      this.initEditToolsEvents()
      this.initPostNewBtns()
    },
    initNewPolylineControl() {
      let that = this
      L.NewPolylineControl = L.Control.extend({
        options: {
          position: "topleft"
        },
        onAdd: function (map) {
          var container = L.DomUtil.create("div", "leaflet-control leaflet-bar"),
            link = L.DomUtil.create("a", "", container);
          link.href = "#";
          link.title = "Создать новый маршрут";
          link.innerHTML = "<span class=\"el-icon-plus\"></span>"
          link.id = "leaflet-new-polyline-btn"

          // stopPropagation for map events
          L.DomEvent.disableClickPropagation(container)
          L.DomEvent.disableClickPropagation(link)
          L.DomEvent.on(link, "click", L.DomEvent.stop)
            .on(link, "click", function () {
              if (that.selectedPath) {
                const e = map.editTools.startPolyline()
                e.customId = ROUTE_POLYLINE_CREATOR
                that.$emit("polyline-click")
              } else {
                that.$message({
                  message: "Выберите путь",
                  type: "warning",
                  duration: 3000,
                  showClose: true,
                })
              }
            });
          container.style.display = "block";
          map.editTools.on("editable:enabled", function (e) {
            if (e.target && e.target.currentPolyline
            && e.target.currentPolyline.customId === ROUTE_POLYLINE_CREATOR)
              container.style.display = "none";
          });
          map.editTools.on("editable:disable", function (e) {
            if (e.layer && e.layer.customId && e.layer.customId === ROUTE_POLYLINE_CREATOR)
              container.style.display = "block";
          });
          return container;
        }
      });
      this.addNewPolylineControl = () => {
        if (this.newPolylineControl) this.map.removeControl(this.newPolylineControl)
        this.newPolylineControl = new L.NewPolylineControl()
        this.map.addControl(this.newPolylineControl);
      }
      this.removeNewPolylineControl = () => {
        if (this.newPolylineControl) this.map.removeControl(this.newPolylineControl)
      }
    },
    initEditToolsEvents() {
      let that = this
      let func1 = function (e) {
        setTimeout(() => {
          if (e.layer.customId && e.layer.customId === ROUTE_POLYLINE_CREATOR) {
            that.addPostNewBtns()
            that.$store.dispatch("Map/actionSetEditState", true)
            that.newPolyline = e.layer
            if (this.currentPolyline) this.currentPolyline.disableEdit();
            this.currentPolyline = e.layer;
            this.currentPolyline.on("click", function (e) {
              if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
                this.editor.newHole(e.latlng)
              }
            })
            this.fire("editable:enabled")
          }
        })
      }
      let func2 = function (e) {
        if (e.layer.customId && e.layer.customId === ROUTE_POLYLINE_CREATOR)
          that.newPolyline = e.layer
      }
      let func3 = function (e) {
        if (e.layer.customId && e.layer.customId === ROUTE_POLYLINE_CREATOR)
          delete this.currentPolyline
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
      return L.easyButton({
        id: "leaflet-save-new-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [
          {
            stateName: "save", title: "Сохранить", icon: "el-icon-check",
            onClick: () => {
              this.save()
            },
          }
        ]
      })
    },
    getCancelBtn() {
      return L.easyButton({
        id: "leaflet-cancel-new-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{
          stateName: "cancel", title: "Отменить", icon: "el-icon-close",
          onClick: () => {
            this.removePostNewBtns()
            this.disableEditNewPolyline()
            this.removeNewPolyline()
            this.$emit("cancel")
            this.$store.dispatch("Map/actionSetEditState", false)
          }
        }]
      })
    },
    save() {
      try {
        let body = {
          kml: tokml(this.newPolyline.toGeoJSON()),
        }
        this.$emit("save", body)
      } catch (e) {
        this.$emit("cancel")
      }
    },
    commitSave() {
      this.removePostNewBtns()
      this.disableEditNewPolyline()
      this.removeNewPolyline()
      this.$store.dispatch("Map/actionSetEditState", false)
    },
    enableEditNewPolyline() {
      if (this.newPolyline && this.newPolyline instanceof L.Polyline)
        this.newPolyline.enableEdit()
    },
    disableEditNewPolyline() {
      if (this.newPolyline && this.newPolyline instanceof L.Polyline)
        this.newPolyline.disableEdit()
    },
    removeNewPolyline() {
      if (this.newPolyline && this.newPolyline instanceof L.Polyline)
        this.map.removeLayer(this.newPolyline)
    },
  }
}
</script>
