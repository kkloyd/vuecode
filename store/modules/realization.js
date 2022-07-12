const state = {
  item: null,
};

const getters = {
  getItem: (state) => {
    return state.item
  },
};

const mutations = {
  setItem: (state, payload) => {
    state.item = payload
  },
};

const actions = {
  actionSetItem: ({commit}, payload) => {
    commit("setItem", payload);
  },
  actionUnsetItem: ({commit}) => {
    commit("setItem", null);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
