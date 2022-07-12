import Vue from "vue";

const state = {
  draggingEchelonGuid: "",
  draggingWorkPlanGuid: "",
  draggingNewWorkPlan: null,
  selectedEchelon: null,
  changedEchelons: [],
  allEchelons: [],
  sowingFields: [],
  commonSowings: [],
  filterOptions: {
    fieldId: null,
    brigadeId: null,
    cultureId: null,
    previousCultureId: null,
    fieldScore: [],
    echelonGuid: null
  },
};

const getters = {
  getDraggingEchelonGuid: s => s.draggingEchelonGuid,
  getDraggingWorkPlanGuid: s => s.draggingWorkPlanGuid,
  getDraggingNewWorkPlan: s => s.draggingNewWorkPlan,
  getSelectedEchelon: s => s.selectedEchelon,
  getChangedEchelons: s => s.changedEchelons,
  getAllEchelons: s => s.allEchelons,
  getFilterOptions: s => s.filterOptions,
  getSowingFields: s => s.sowingFields,
  getCommonSowings: s => s.commonSowings
};

const mutations = {
  setDraggingEchelonGuid(state, val) {
    state.draggingEchelonGuid = val
  },
  setDraggingWorkPlanGuid(state, val) {
    state.draggingWorkPlanGuid = val
  },
  setDraggingNewWorkPlan(state, val) {
    state.draggingNewWorkPlan = val
  },
  setSelectedEchelon(state, val) {
    state.selectedEchelon = val
  },
  setSelectedEchelonWorkStart(state, val) {
    if (state.selectedEchelon) {
      if (state.selectedEchelon.workStart === undefined) {
        Vue.set(state.selectedEchelon, "workStart", val)
      }
      else {
        state.selectedEchelon.workStart = val
      }
    }
  },
  setAllEchelons(state, val) {
    state.allEchelons = val
  },
  setFilterOptions: (state, payload) => {
    state.filterOptions = payload;
  },
  setSowingFields: (state, payload) => {
    state.sowingFields = payload;
  },
  setCommonSowings: (state, payload) => {
    state.commonSowings = payload;
  },

  setChangedEchelon(state, val) {
    let echelon = state.changedEchelons.find(x => x.guid === val.guid)
    if (echelon) {
      state.changedEchelons.splice(
        state.changedEchelons.findIndex(ech => ech.guid === echelon.guid), 1);
      if (!(!val.id && val.isDeleted)) {
        state.changedEchelons.push(val)
      }
    } else {
      state.changedEchelons.push(val)
    }
  },
  resetChangedEchelons(state) {
    state.changedEchelons = []
  },
  changedBreakInDays(state, val) {
    let echelon = state.allEchelons.find(x => x.guid === val.echelonGuid)
    let workPlan = echelon.workPlans.find(x => x.guid === val.workPlanGuid)
    workPlan.breakInDays = val.breakInDays
  },
};

const actions = {
  actionSetDraggingEchelonGuid({commit}, val) {
    commit("setDraggingEchelonGuid", val)
  },
  actionSetDraggingWorkPlanGuid({commit}, val) {
    commit("setDraggingWorkPlanGuid", val)
  },
  actionSetDraggingNewWorkPlan({commit}, val) {
    commit("setDraggingNewWorkPlan", val)
  },
  actionSetSelectedEchelon({commit}, val) {
    commit("setSelectedEchelon", val)
  },
  actionSetSelectedEchelonWorkStart({commit}, val) {
    commit("setSelectedEchelonWorkStart", val)
  },
  actionSetAllEchelons({commit}, val) {
    commit("setAllEchelons", val)
  },
  actionSetFilterOptions: ({commit}, payload) => {
    commit("setFilterOptions", payload);
  },
  actionSetSowingFields: ({commit}, payload) => {
    commit("setSowingFields", payload);
  },
  actionSetCommonSowings: ({commit}, payload) => {
    commit("setCommonSowings", payload);
  },
  actionSetChangedEchelon({commit}, val) {
    commit("setChangedEchelon", val)
  },
  actionResetChangedEchelons({commit}) {
    commit("resetChangedEchelons")
  },
  actionResetAll({commit}) {
    commit("setDraggingEchelonGuid", "")
    commit("setDraggingWorkPlanGuid", "")
    commit("setSelectedEchelon", null)
    commit("resetChangedEchelons")
  },
  actionChangeBreakInDays({commit}, val) {
    commit("changedBreakInDays", val)
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
