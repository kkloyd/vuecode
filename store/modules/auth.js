function initialState() {
  return {
    status: "",
    profile: null,
  }
}

const state = {
  ...initialState(),
};

const getters = {
  getStatus: (state) => {
    return state.status
  },
  getProfile: (state) => {
    return state.profile
  },
};

const mutations = {
  setStatus: (state, payload) => {
    state.status = payload
  },
  initProfile: (state) => {
    let profile = JSON.parse(localStorage.getItem("profile"))
    state.profile = profile
  },
  setProfile: (state, payload) => {
    state.profile = payload
  },
  saveProfile: (state) => {
    localStorage.setItem("profile", JSON.stringify(state.profile))
  },
  removeProfile: () => {
    localStorage.removeItem("profile")
  },
  reset: (state) => {
    const iState = initialState()
    Object.keys(iState).forEach(key => {
      state[key] = iState[key]
    })
  },
};

const actions = {
  actionSetStatus: ({commit}, payload) => {
    commit("setStatus", payload);
  },
  actionInitProfile: ({commit}) => {
    commit("initProfile");
  },
  actionSetProfile: ({commit}, payload) => {
    commit("setProfile", payload);
    commit("saveProfile");
  },
  actionRemoveProfile: ({commit}) => {
    commit("removeProfile");
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
