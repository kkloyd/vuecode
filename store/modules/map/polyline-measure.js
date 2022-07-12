const state = {
  totalDistance: null,
};

const getters = {
  getTotalDistance: (state) => {
    return state.totalDistance
  },
};

const mutations = {
  setTotalDistance: (state, payload) => {
    state.totalDistance = payload
  },
  reset: (state) => {
    state.totalDistance = null
  }
};

const actions = {
  actionSetTotalDistance({commit}, payload) {
    commit("setTotalDistance", payload);
  },
  actionReset({commit}) {
    commit("reset")
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
