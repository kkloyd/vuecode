const state = {
  width: "full-width",
};

const getters = {
  getWidth: (state) => {
    return state.width
  },
};

const mutations = {
  initWidth: (state) => {
    let width = JSON.parse(localStorage.getItem("width")) || "full-width"
    state.width = width
  },
  setWidth: (state, payload) => {
    state.width = payload
  },
  saveWidth: (state) => {
    localStorage.setItem("width", JSON.stringify(state.width))
  },
};

const actions = {
  actionInitWidth: ({commit}) => {
    commit("initWidth");
  },
  actionSetWidth: ({commit}, payload) => {
    commit("setWidth", payload);
    commit("saveWidth");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
