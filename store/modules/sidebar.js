
const sidebarToggleState = localStorage.getItem("sidebarToggleState")
const state = {
  toggleState: [undefined, null].includes(sidebarToggleState) ? true : JSON.parse(sidebarToggleState),
}

const getters = {
  getToggleState: (state) => {
    return state.toggleState
  },
}

const mutations = {
  setToggleState: (state, payload) => {
    state.toggleState = payload
    localStorage.setItem("sidebarToggleState", payload)
  },
}

const actions = {
  actionSetToggleState: ({commit}, payload) => {
    commit("setToggleState", payload)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
