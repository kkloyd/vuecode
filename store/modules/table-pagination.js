const state = {
  pageSizes: {},
  pageSize: null,
  page: null,
};

const getters = {
  getPageSizes: (state) => {
    return state.pageSizes
  },
  getPageSize: (state) => (id) => {
    return state.pageSizes[id]
  },
  getPage: (state) => {
    return state.page
  },
};

const mutations = {
  initPageSizes: (state) => {
    let pageSizes = JSON.parse(localStorage.getItem("pageSizes")) || {}
    state.pageSizes = pageSizes
  },
  setPageSizes: (state, {id, size}) => {
    state.pageSizes[id] = size
  },
  savePageSizes: (state) => {
    localStorage.setItem("pageSizes", JSON.stringify(state.pageSizes))
  },
  setPage: (state, payload) => {
    state.page = payload
  },
};

const actions = {
  actionInitPageSizes: ({commit}) => {
    commit("initPageSizes");
  },
  actionSetPageSizes: ({commit}, payload) => {
    commit("setPageSizes", payload);
    commit("savePageSizes");
  },
  actionSetPage: ({commit}, payload) => {
    commit("setPage", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
