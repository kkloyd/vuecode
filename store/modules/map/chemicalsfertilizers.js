// USED for tabs and overlays: chemicals and fertilizers

// data - type Object
const state = {
  data: null
}

const getters = {
  getData: (state) => {
    return state.data
  },
}

const mutations = {
  setData: (state, payload) => {
    state.data = payload
  },
  clearData: (state) => {
    state.data = null
  },
}

const actions = {
  actionSetData({commit}, payload) {
    commit("setData", payload)
  },
  actionClear({commit}) {
    commit("clearData")
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
