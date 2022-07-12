function initialState() {
  return {
    newSowings: [],
    sowingFields: [],
    selectedFields: [],
    selectedFieldId: null,
    filterOptions: {
      fieldId: null,
      brigadeId: null,
      previousCultureId: null,
      sowingType: 1,
      fieldScore: [],
    },
    sowingsModified: 0,
  }
}

const state = {
  ...initialState(),
};

const getters = {
  getNewSowings: (state) => {
    return state.newSowings;
  },
  getSowingFields: (state) => {
    return state.sowingFields;
  },
  getSelectedFieldId: (state) => {
    return state.selectedFieldId;
  },
  getSelectedFields: (state) => {
    return state.selectedFields;
  },
  getFilterOptions: (state) => {
    return state.filterOptions;
  },
  getSowingsModified: (state) => {
    return state.sowingsModified;
  },
};

const mutations = {
  setNewSowings: (state, payload) => {
    state.newSowings = payload;
  },
  setSowingFields: (state, payload) => {
    state.sowingFields = payload;
  },
  setSelectedFieldId: (state, payload) => {
    state.selectedFieldId = payload;
  },
  setSelectedFields: (state, payload) => {
    state.selectedFields = payload;
  },
  setFilterOptions: (state, payload) => {
    state.filterOptions = payload;
  },
  setSowingsModified: (state) => {
    state.sowingsModified++;
  },
  reset: (state) => {
    const iState = initialState()
    Object.keys(iState).forEach(key => {
      state[key] = iState[key]
    })
  },
};

const actions = {
  actionSetNewSowings: ({commit}, payload) => {
    commit("setNewSowings", payload);
  },
  actionSetSowingFields: ({commit}, payload) => {
    commit("setSowingFields", payload);
  },
  actionSetSelectedFieldId: ({commit}, payload) => {
    commit("setSelectedFieldId", payload);
  },
  actionSetSelectedFields: ({commit}, payload) => {
    commit("setSelectedFields", payload);
  },
  actionSetFilterOptions: ({commit}, payload) => {
    commit("setFilterOptions", payload);
  },
  actionSetSowingsModified: ({commit}) => {
    commit("setSowingsModified");
  },
  actionReset: ({commit}) => {
    commit("reset");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
