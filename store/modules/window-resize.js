const state = {
  height: null,
};

const getters = {
  getHeight: (state) => {
    return state.height
  },
};

const mutations = {
  setHeight: (state, payload) => {
    state.height = payload
  },
};

const actions = {
  actionSetHeight: ({commit}, payload) => {
    commit("setHeight", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
