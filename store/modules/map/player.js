const state = {
  date: null,
};

const getters = {
  getDate: (state) => {
    return state.date
  },
};

const mutations = {
  setDate: (state, payload) => {
    state.date = payload
  },
};

const actions = {
  actionSetDate({commit}, payload) {
    commit("setDate", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
