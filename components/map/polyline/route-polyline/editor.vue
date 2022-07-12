<template>
  <div/>
</template>

<script>
import L from "leaflet"
import "leaflet-easybutton"
import tokml from "tokml"
import "leaflet-editable"
import {deepClone} from "@/lib/utils"

export default {
  name: "RoutePolylineEditor",
  props: {
    map: {
      type: Object,
      default: () => {},
    },
    selectedLayer: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editBtn: null,
      postEditBtns: null,
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.removePostEditBtns()
  },
  methods: {
    init() {
      this.$emit("edit-click")
      this.initPostEditBtns()
      this.editPolyline(this.selectedLayer)
    },
    editPolyline(polyline) {
      this.$store.dispatch("Map/actionSetEditState", true)
      this.addPostEditBtns()
      this.addPostEditFunctions(polyline)
      polyline.enableEdit()
      polyline.on("click", function (e) {
        if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
          this.editor.newHole(e.latlng)
        }
      })
    },
    addPostEditFunctions(polyline) {
      let latLngs = deepClone(polyline.getLatLngs())
      this.cancelEdit = () => {
        polyline.setLatLngs(latLngs)
      }
      this.disableEdit = () => {
        this.$store.dispatch("Map/actionSetEditState", false)
        this.removePostEditBtns()
        polyline.disableEdit()
      }
    },
    initPostEditBtns() {
      let saveBtn = this.getSaveBtn()
      let cancelBtn = this.getCancelBtn()
      this.postEditBtns = L.easyBar([cancelBtn, saveBtn])
      this.addPostEditBtns = () => {
        this.postEditBtns.addTo(this.map)
      }
      this.removePostEditBtns = () => {
        if (this.postEditBtns) this.postEditBtns.remove()
      }
    },
    getSaveBtn() {
      return L.easyButton({
        id: "leaflet-save-edited-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{stateName: "save", title: "Сохранить", icon: "el-icon-check", onClick: this.save}]
      })
    },
    getCancelBtn() {
      return L.easyButton({
        id: "leaflet-cancel-edit-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{
          stateName: "cancel", title: "Отменить", icon: "el-icon-close",
          onClick: () => {
            this.revert()
            this.$emit("cancel")
          }
        }]
      })
    },
    save() {
      let body = {
        kml: tokml(this.selectedLayer.toGeoJSON()),
      }
      this.$emit("save", body)
    },
    revert() {
      if (this.cancelEdit) this.cancelEdit()
      if (this.disableEdit) this.disableEdit()
    },
  },
  commitSave() {
    if (this.disableEdit) this.disableEdit()
    this.$store.dispatch("Map/actionSetEditState", false)
  },
}
</script>
