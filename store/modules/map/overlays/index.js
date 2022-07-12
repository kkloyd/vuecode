import massives from "./massives"

function initialState() {
  let state = {
    overlay: {},
    overlaysList: [],
    culture: null,
    work: null,
    selectWorks: [],
    works: [],
    worksLoading: false,
    preparation: null,
    fieldType: null,
    fieldScore: null,
    overlayName: null,
    selectedFieldIds: "",
    fieldMassives: []
  }
  if (localStorage.getItem("overlayName")) {
    state.overlayName = localStorage.getItem("overlayName")
  }
  return state
}
const initStyle = {
  default: {color: "#000", fillColor: "rgba(140, 140, 140, 1)", weight: 1, fillOpacity: 0.45, className: ""},
  selected: {color: "#20a0ff", fillColor: "rgba(140, 140, 140, 1)", weight: 3, fillOpacity: 0.55, className: ""},
  active: {color: "yellow", weight: 10, fillColor: "rgba(255, 255, 255, 1)", fillOpacity: .55, className: ""},
  green: {color: "#000", fillColor: "#0f0", weight: 1, fillOpacity: 0.55},
  red: {color: "#000", fillColor: "#f00", weight: 1, fillOpacity: 0.55},
  selectedBorder: {color: "#20a0ff", weight: 3},
  types: {
    0: {color: "#000", fillColor: "rgba(140, 140, 140, 1)", weight: 1, fillOpacity: 0.45, className: ""},
    2: {color: "#000", fillColor: "rgba(220, 220, 220, 1)", weight: 1, fillOpacity: 0.45, className: ""},
  },
  focus: {},
  focusOut: {},

  warehouse: {color: "#000", fillColor: "rgba(153, 102, 51, 1)", weight: 1, fillOpacity: 0.35, className: ""},
  contractor: {color: "#000", fillColor: "rgba(153, 102, 51, 1)", weight: 1, fillOpacity: 0.35, className: ""},
}

const state = {
  ...initialState(),
  ...massives.state,
  style: initStyle
}

const getters = {
  getOverlay: (state) => {
    return state.overlay
  },
  getMapStyle: (state) => {
    return state.style
  },
  getOverlaysList: (state) => {
    return state.overlaysList
  },
  getFieldMassives: (state) => {
    return state.fieldMassives
  },
  getCulture: (state) => {
    return state.culture
  },
  getWork: (state) => {
    return state.work
  },
  getSelectWorks: (state) => {
    return state.selectWorks
  },
  getWorks: (state) => {
    return state.works
  },
  getWorksloading: (state) => {
    return state.worksLoading
  },
  getPreparation: (state) => {
    return state.preparation
  },
  getFieldType: (state) => {
    return state.fieldType
  },
  getFieldScore: (state) => {
    return state.fieldScore
  },
  getOverlayName: (state) => {
    return state.overlayName
  },
  getSelectedFieldIds: (state) => {
    return state.selectedFieldIds
  },
  ...massives.getters
}

const mutations = {
  setOverlay: (state, payload) => {
    state.overlay = payload
    if (payload) {
      state.overlayName = payload.name
      localStorage.setItem("overlayName", payload.name)
    }
  },
  addToOverlaysList: (state, payload) => {
    state.overlaysList.push(payload)
  },
  setFieldMassives: (state, payload) => {
    state.fieldMassives = payload
  },
  setCulture: (state, payload) => {
    state.culture = payload
  },
  setWork: (state, payload) => {
    let workIds = payload ? [payload] : []
    if (payload && !parseInt(payload)) {
      let id = payload.split('-')[1]
      workIds = state.works.filter(w => w.echelonType === parseInt(id)).map(w => w.key)
    }
    state.selectWorks = workIds
    state.work = payload
  },
  setWorks: (state, payload) => {
    state.works = payload
  },
  setWorksLoading: (state, payload) => {
    state.worksLoading = payload
  },
  setPreparation: (state, payload) => {
    state.preparation = payload
  },
  setFieldType: (state, payload) => {
    state.fieldType = payload
  },
  setFieldScore: (state, payload) => {
    state.fieldScore = payload
  },
  reset: (state) => {
    const iState = initialState()
    Object.keys(iState).forEach(key => {
      state[key] = iState[key]
    })
  },
  setSelectedFieldIds: (state, payload) => {
    state.selectedFieldIds = payload
  },
  ...massives.mutations
}

const actions = {
  actionSetOverlay({commit}, payload) {
    commit("setOverlay", payload);
  },
  actionAddToOverlaysList: ({commit}, payload) => {
    commit("addToOverlaysList", payload)
  },
  actionSetFieldMassives: ({commit}, payload) => {
    commit("setFieldMassives", payload);
  },
  actionSetCulture({commit}, payload) {
    commit("setCulture", payload);
  },
  actionSetWork({commit}, payload) {
    commit("setWork", payload);
  },
  actionSetWorks({commit}, payload) {
    commit("setWorks", payload);
  },
  actionSetWorksLoading({commit}, payload) {
    commit("setWorksLoading", payload);
  },
  actionSetPreparation({commit}, payload) {
    commit("setPreparation", payload);
  },
  actionSetFieldType({commit}, payload) {
    commit("setFieldType", payload);
  },
  actionSetFieldScore({commit}, payload) {
    commit("setFieldScore", payload);
  },
  actionReset: ({commit}) => {
    commit("reset");
  },
  actionSetSelectedFieldIds: ({commit}, payload) => {
    commit("setSelectedFieldIds", payload)
  },
  ...massives.actions
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
