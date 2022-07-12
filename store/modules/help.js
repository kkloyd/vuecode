const state = {
  type: {
    root: 1,
    module: 2,
    section: 3,
    article: 4,
  },
  searchQuery: "",
  modes: [
    {key: "global", name: "Помощь"},
    {key: "agrofact", name: "Агрофакт"},
    {key: "agroplan", name: "Агроплан"},
    {key: "grainbalance", name: "Баланс зерна"},
    {key: "admin", name: "Админ"},
  ],
  mode: "global",
  path: [],
};

const getters = {
  getSearchQuery: (state) => {
    return state.searchQuery
  },
  getMode: (state) => {
    return state.mode
  },
  getModeKeyByName: (state) => (name) => {
    let mode = state.modes.find(mode => mode.name == name)
    return mode && mode.key
  },
  getPath: (state) => {
    return state.path
  },
  getType: (state) => {
    return state.type
  },
};

const mutations = {
  setSearchQuery: (state, payload) => {
    state.searchQuery = payload
  },
  setMode: (state, payload) => {
    let mode = state.modes.find(mode => mode.key == payload)
    state.mode = mode.name
  },
  setPath: (state, payload) => {
    state.path = payload
  },
  resetPath: (state) => {
    state.path = []
  },
};

const actions = {
  actionSetSearchQuery: ({commit}, payload) => {
    commit("setSearchQuery", payload);
  },
  actionSetMode: ({commit}, payload) => {
    commit("setMode", payload);
  },
  actionResetMode: ({commit}) => {
    commit("setMode", "global");
  },
  actionSetPath: ({commit}, payload) => {
    commit("setPath", payload);
  },
  actionResetPath: ({commit}) => {
    commit("resetPath");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
