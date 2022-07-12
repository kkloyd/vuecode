<template>
  <div/>
</template>

<script>
import L from "leaflet"
import "leaflet-easybutton"
import tokml from "tokml"
import {deepClone} from "@/lib/utils"

export default {
  name: "RoutePolylineCreatorFromTransfer",
  props: {
    "map": {
      type: Object,
      default: () => {},
    },
    "selectedTransfer": {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      createBtn: null,
      postCreateBtns: null,
    }
  },
  created() {
    this.init()
    this.addCreateBtn()
  },
  beforeDestroy() {
    this.removeCreateBtn()
    this.removePostCreateBtns()
  },
  methods: {
    init() {
      this.initCreateBtn()
      this.initPostCreateBtns()
    },
    initCreateBtn() {
      this.createBtn = L.easyButton({
        id: "leaflet-create-from-transfer-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [
          {
            stateName: "create", title: "Создать маршрут с трансфера", icon: "el-icon-sort",
            onClick: () => {
              this.removeCreateBtn()
              this.confirmCreatePolyline(this.selectedTransfer)
            },
          }
        ]
      })
      this.addCreateBtn = () => {
        this.createBtn.addTo(this.map)
      }
      this.removeCreateBtn = () => {
        if (this.createBtn) this.createBtn.remove()
      }
    },
    confirmCreatePolyline(polyline) {
      this.$store.dispatch("Map/actionSetEditState", true)
      this.addPostCreateBtns()
      this.addPostCreateFunctions(polyline)
    },
    addPostCreateFunctions(polyline) {
      let latLngs = deepClone(polyline.getLatLngs())
      this.cancelCreate = () => {
        polyline.setLatLngs(latLngs)
      }
      this.disableCreate = () => {
        this.$store.dispatch("Map/actionSetEditState", false)
        this.addCreateBtn()
        this.removePostCreateBtns()
      }
    },
    initPostCreateBtns() {
      let saveBtn = this.getSaveBtn()
      let cancelBtn = this.getCancelBtn()
      this.postCreateBtns = L.easyBar([cancelBtn, saveBtn])
      this.addPostCreateBtns = () => {
        this.postCreateBtns.addTo(this.map)
      }
      this.removePostCreateBtns = () => {
        if (this.postCreateBtns) this.postCreateBtns.remove()
      }
    },
    getSaveBtn() {
      return L.easyButton({
        id: "leaflet-save-created-from-transfer-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
        states: [{stateName: "save", title: "Сохранить", icon: "el-icon-check", onClick: this.save}]
      })
    },
    getCancelBtn() {
      return L.easyButton({
        id: "leaflet-cancel-create-from-transfer-polyline-btn", position: "topleft", type: "replace", leafletClasses: true,
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
        kml: tokml(this.selectedTransfer.toGeoJSON()),
        createdFromTransfer: true
      }
      this.disableCreate()
      this.$emit("save", body)
    },
    revert() {
      if (this.cancelCreate) this.cancelCreate()
      if (this.disableCreate) this.disableCreate()
    },
  }
}
</script>
