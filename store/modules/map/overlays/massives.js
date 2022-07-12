const state = {
  formMassive: {
    id: null,
    text: null,
    fieldIds: [],
    dashAngle: 0,
  },
  massives: [],
  nonMassives: [],
  selectedMassive: null,
  dashAngle: 0,
  createMode: false,
}
// TODO refactor separate vuex module, ex: store.getters["Map/Massives
const getters = {
  getFormMassive: (state) => state.formMassive,
  getDashAngle: (state) => state.dashAngle,
  getMassives: (state) => state.massives,
  getSelectedMassive: (state) => state.selectedMassive,
  getNonMassives: (state) => state.nonMassives,
  getCreateMode: (state) => state.createMode
}

const mutations = {
  setFormMassive: (state, payload) => {
    state.formMassive = payload
  },
  setDashAngle: (state, payload) => {
    state.dashAngle = payload
  },
  setMassives: (state, payload) => {
    state.massives = payload
  },
  setNonMassives: (state, payload) => {
    state.nonMassives = payload
  },
  setSelectedMassive: (state, payload) => {
    state.selectedMassive = payload
  },
  setCreateMode: (state, payload) => {
    state.createMode = payload
  }
}

const actions = {
  actionSetFormMassive: ({commit}, payload) => {
    commit("setFormMassive", payload)
  },
  actionUnsetFormMassive: ({commit}, payload) => {
    commit("setFormMassive", {
      id: null,
      text: null,
      fieldIds: []
    })
  },
  actionSetDashAngle: ({commit}, payload) => {
    commit("setDashAngle", payload)
  },
  actionSetMassives: ({commit}, payload) => {
    commit("setMassives", payload)
  },
  actionSetNonMassives: ({commit}, payload) => {
    commit("setNonMassives", payload)
  },
  actionSetSelectedMassive: ({commit}, payload) => {
    commit("setSelectedMassive", payload)
  },
  actionSetCreateMode: ({commit}, payload) => {
    commit("setCreateMode", payload)
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
}
