const state = {
  searchState: false,
};

const getters = {
  getSearchState: (state) => {
    return state.searchState
  },
};

const mutations = {
  setSearchState: (state, payload) => {
    state.searchState = payload
  },
};

const actions = {
  actionSetSearchState: ({commit}, payload) => {
    commit("setSearchState", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
