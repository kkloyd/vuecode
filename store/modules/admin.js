import GlobalMethods from "@/lib/GlobalMethods"

const state = {
  filterOptions: {},
};

const getters = {
  getFilterOptions: (state) => {
    return state.filterOptions
  },
};

const mutations = {
  setFilterOptions: (state, payload) => {
    state.filterOptions = payload
  },
  saveFilterOptions: (state) => {
    localStorage.setItem("filterOptions", JSON.stringify(state.filterOptions))
  },
  removeFilterOptions: () => {
    localStorage.removeItem("filterOptions")
  },
  InitFilterOptions: (state) => {
    let filterOptions = JSON.parse(localStorage.getItem("filterOptions")) || {}
    state.filterOptions = filterOptions
  },
};

const actions = {
  actionSetFilterOptions: ({commit}, payload) => {
    commit("setFilterOptions", payload);
    commit("saveFilterOptions")
  },
  actionInitFilterOptions: ({commit, state, dispatch}) => {
    commit("InitFilterOptions")
  },
  actionRemoveFilterOptions: ({commit, state, dispatch}) => {
    commit("removeFilterOptions")
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
