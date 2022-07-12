import GlobalMethods from "@/lib/GlobalMethods"

const state = {
  state: true,
  module: "",
  organizationType: null,
};

const getters = {
  getState: (state) => {
    return state.state
  },
  getModule: (state) => {
    return state.module
  },
  getOrganizationType: (state) => {
    return state.organizationType
  },
};

const mutations = {
  setState: (state, payload) => {
    state.state = payload
  },
  setModule: (state, payload) => {
    state.module = payload
  },
  setOrganizationType: (state) => {
    state.organizationType = GlobalMethods.getOrganizationType()
  },
};

const actions = {
  actionSetState: ({commit}, payload) => {
    commit("setState", payload);
  },
  actionSetModule: ({commit}, payload) => {
    commit("setModule", payload);
  },
  actionSetOrganizationType: ({commit}) => {
    commit("setOrganizationType");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
