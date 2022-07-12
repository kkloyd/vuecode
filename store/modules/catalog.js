import {deepClone} from "@/lib/utils";

const state = {
  filter: {},
  data: []
};

const getters = {
  getFilter: (state) => {
    return state.filter
  },
  getCatalogData: (state) => {
    return state.data
  },
};

const mutations = {
  setFilter: (state, payload) => {
    state.filter = payload
  },
  setCatalogData: (state, payload) => {
    state.data = deepClone(payload)
  },
  setSaveDataItem: (state, payload) => {
    if (state.data.generated) {
      for (let i = 0; i < state.data.generated.length; i++) {
        if (state.data.generated[i].id === payload.id) {
          state.data.generated[i] = deepClone({...state.data.generated[i], ...payload})
        }
      }
    }
  },
  addDataItem: (state, payload) => {
    if (state.data.generated) {
      state.data.generated.unshift(payload)
    }
  },
  deleteDataItem: (state, payload) => {
    if (state.data.generated) {
      state.data.generated = state.data.generated.filter(a => a.id !== payload.id)
    }
  },
};

const actions = {
  actionSetFilter: ({commit}, payload) => {
    commit("setFilter", payload);
  },
  actionUnsetFilter: ({commit}) => {
    commit("setFilter", {});
  },
  actionSetCatalogData: ({commit}, payload) => {
    commit("setCatalogData", payload);
  },
  actionSaveDataItem: ({commit}, payload) => {
    commit("setSaveDataItem", payload);
  },
  actionAddDataItem: ({commit}, payload) => {
    commit("addDataItem", payload);
  },
  actionDeleteDataItem: ({commit}, payload) => {
    commit("deleteDataItem", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
