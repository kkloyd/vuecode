const state = {
  filter: {
    till: null,
    from: null,
    warehouseId: null,
    grainProcessingTypeId: null,
    cultureIds: [],
    finalProductTypeIds: [],
    storageIds: [],
    ownerCustomOrganizationIds: [],
  }
};

const getters = {
  getFilter: (state) => {
    return state.filter
  },
};

const mutations = {
  setFilter: (state, payload) => {
    state.filter = payload
  },

};

const actions = {
  actionSetFilter: ({commit}, payload) => {
    commit("setFilter", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
