const state = {
  transition: false,
  transitionTimeout: undefined,
};

const getters = {
  getTransition: (state) => {
    return state.transition
  },
  getTransitionTimeout: (state) => {
    return state.transitionTimeout
  },
};

const mutations = {
  setTransition: (state, payload) => {
    state.transition = payload
  },
  setTransitionTimeout: (state, payload) => {
    state.transitionTimeout = payload
  },
  clearTransitionTimeout: (state) => {
    clearTimeout(state.transitionTimeout)
    state.transitionTimeout = undefined
  },
};

const actions = {
  actionSetTransition: ({dispatch}, payload) => {
    dispatch("actionSetTransitionTimeout", payload)
  },
  actionSetTransitionTimeout: ({commit, state}, payload) => {
    if (state.transitionTimeout) {
      commit("clearTransitionTimeout")
    }
    let transitionTimeout = setTimeout(function () {
      commit("setTransition", payload)
    }, 300)
    commit("setTransitionTimeout", transitionTimeout)
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
