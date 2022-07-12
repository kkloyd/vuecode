import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from "darkreader"

const state = {
  theme: "day",
  options: {
    mode: 1
  },
};

const getters = {
  getTheme: (state) => {
    return state.theme
  },
  getOptions: (state) => {
    return state.options
  },
};

const mutations = {
  initTheme: (state) => {
    let theme = JSON.parse(localStorage.getItem("theme")) || "day"
    let options = JSON.parse(localStorage.getItem("themeOptions")) || {mode: 1}
    state.theme = theme
    state.options = options
  },
  setTheme: (state, payload) => {
    state.theme = payload
  },
  saveTheme: (state) => {
    localStorage.setItem("theme", JSON.stringify(state.theme))
  },
  setOptions: (state, payload) => {
    state.options = payload
  },
  saveOptions: (state) => {
    localStorage.setItem("themeOptions", JSON.stringify(state.options))
  },
};

const actions = {
  actionInitTheme: ({commit, state}) => {
    commit("initTheme")
    handleChange(state)
  },
  actionSetTheme: ({commit, state}, payload) => {
    commit("setTheme", payload)
    commit("saveTheme")
    handleChange(state)
  },
  actionSetOptions: ({commit, state}, payload) => {
    commit("setOptions", payload)
    commit("saveOptions")
    handleChange(state)
  },
};

function handleChange({theme, options}) {
  if (theme == "night") {
    enableDarkMode(options)
  } else {
    disableDarkMode()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
