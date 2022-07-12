function initialState() {
  let state = {
    overlay: {},
    overlaysList: [],
    culture: null,
    work: null,
    works: [],
    worksLoading: false,
    preparation: null,
    fieldType: null,
    fieldScore: null,
    overlayName: null,
    groupedPolygons: [],
    newMassiveName: null,
    newMassiveFields: [],
    hatchAngle: 0,
    hatchMode: null,
    hatchColor: null,
    fieldsMassive: [],
    fieldsMassiveId: null,
    selectedFieldIds: "",
  }
  if (localStorage.getItem("overlayName")) {
    state.overlayName = localStorage.getItem("overlayName")
  }
  return state
}

const state = {
  ...initialState(),
}

const getters = {
  getOverlay: (state) => {
    return state.overlay
  },
  getOverlaysList: (state) => {
    return state.overlaysList
  },
  getCulture: (state) => {
    return state.culture
  },
  getWork: (state) => {
    return state.work
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
  getGroupedPolygons: (state) => {
    return state.groupedPolygons
  },
  getNewMassiveName: (state) => {
    return state.newMassiveName
  },
  getNewMassiveFields: (state) => {
    return state.newMassiveFields
  },
  getHatchAngle: (state) => {
    return state.hatchAngle
  },
  getHatchColor: (state) => {
    return state.hatchColor
  },
  getHatchMode: (state) => {
    return state.hatchMode
  },
  getFieldsMassive: (state) => {
    return state.fieldsMassive
  },
  getFieldsMassiveId: (state) => {
    return state.fieldsMassiveId
  },
  getSelectedFieldIds: (state) => {
    return state.selectedFieldIds
  }
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
  setCulture: (state, payload) => {
    state.culture = payload
  },
  setWork: (state, payload) => {
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
  setGroupedPolygons: (state, payload) => {
    state.groupedPolygons = payload
  },
  setNewMassiveName: (state, payload) => {
    state.newMassiveName = payload
  },
  setNewMassiveFields: (state, payload) => {
    state.newMassiveFields = payload
  },
  setHatchAngle: (state, payload) => {
    state.hatchAngle = payload
  },
  setHatchColor: (state, payload) => {
    state.hatchColor = payload
  },
  setHatchMode: (state, payload) => {
    state.hatchMode = payload
  },
  setFieldsMassive: (state, payload) => {
    state.fieldsMassive = payload
  },
  setFieldsMassiveId: (state, payload) => {
    state.fieldsMassiveId = payload
  },
  setSelectedFieldIds: (state, payload) => {
    state.selectedFieldIds = payload
  },
}

const actions = {
  actionSetOverlay({commit}, payload) {
    commit("setOverlay", payload);
  },
  actionAddToOverlaysList: ({commit}, payload) => {
    commit("addToOverlaysList", payload)
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
  actionSetGroupedPolygons: ({commit}, payload) => {
    commit("setGroupedPolygons", payload)
  },
  actionSetNewMassiveName: ({commit}, payload) => {
    commit("setNewMassiveName", payload)
  },
  actionNewMassiveFields: ({commit}, payload) => {
    commit("setNewMassiveFields", payload)
  },
  actionSetHatchAngle: ({commit}, payload) => {
    commit("setHatchAngle", payload)
  },
  actionSetHatchColor: ({commit}, payload) => {
    commit("setHatchColor", payload)
  },
  actionSetHatchMode: ({commit}, payload) => {
    commit("setHatchMode", payload)
  },
  actionSetFieldsMassive: ({commit}, payload) => {
    commit("setFieldsMassive", payload)
  },
  actionSetFieldsMassiveId: ({commit}, payload) => {
    commit("setFieldsMassiveId", payload)
  },
  actionSetSelectedFieldIds: ({commit}, payload) => {
    commit("setSelectedFieldIds", payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
