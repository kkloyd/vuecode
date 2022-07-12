<template>
  <div>
    <div v-if="selectedLayer" class="selected-layer-area">
      <el-tag color="#000">
        {{ getArea(selectedLayer) }} га
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
import {deepClone} from "@/lib/utils"

export default {
  name: "FieldPolygonEditor",
  props: {
    "map": {
      type: Object,
      default: () => {},
    },
    "selectedLayer": {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      editBtn: null,
      // polyArea: false,
      postEditBtns: null,
    }
  },
  created() {
    this.init()
    this.addEditBtn()
  },
  beforeDestroy() {
    this.removeEditBtn()
    this.removePostEditBtns()
  },
  methods: {
    init() {
      this.initEditBtn()
      this.initPostEditBtns()
    },
    initEditBtn() {
      this.editBtn = L.easyButton({
        id: "leaflet-edit-polygon-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [
          {
            stateName: "edit", title: "Редактировать", icon: "el-icon-edit",
            onClick: () => {
              // this.polyArea = true
              this.$emit("edit-click")
              this.removeEditBtn()
              this.editPolygon(this.selectedLayer)
            },
          }
        ]
      })
      this.addEditBtn = () => {
        this.editBtn.addTo(this.map)
      }
      this.removeEditBtn = () => {
        if (this.editBtn) this.editBtn.remove()
      }
    },
    editPolygon(polygon) {
      this.$store.dispatch("Map/actionSetEditState", true)
      this.addPostEditBtns()
      this.addPostEditFunctions(polygon)
      polygon.enableEdit()
      polygon.on("click", function (e) {
        if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
          this.editor.newHole(e.latlng)
        }
      })
    },
    addPostEditFunctions(polygon) {
      let latLngs = deepClone(polygon.getLatLngs())
      this.cancelEdit = () => {
        polygon.setLatLngs(latLngs)
      }
      this.disableEdit = () => {
        this.$store.dispatch("Map/actionSetEditState", false)
        this.addEditBtn()
        this.removePostEditBtns()
        polygon.disableEdit()
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
      let saveBtn = L.easyButton({
        id: "leaflet-save-edited-polygon-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{stateName: "save", title: "Сохранить", icon: "el-icon-check", onClick: this.save}]
      })
      return saveBtn
    },
    getCancelBtn() {
      let cancelBtn = L.easyButton({
        id: "leaflet-cancel-edit-polygon-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{
          stateName: "cancel", title: "Отменить", icon: "el-icon-close",
          onClick: () => {
            // this.polyArea = false
            this.revert()
            this.$emit("cancel")
          }
        }]
      })
      return cancelBtn
    },
    save() {
      let body = {
        kml: tokml(this.selectedLayer.toGeoJSON()),
        fieldId: null,
        kmlArea: this.getArea(this.selectedLayer),
      }
      this.disableEdit()
      this.$emit("save", body)
      // this.polyArea = true
    },
    revert() {
      if (this.cancelEdit) this.cancelEdit()
      if (this.disableEdit) this.disableEdit()
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
