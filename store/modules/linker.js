const state = {
  links: {},
};

const getters = {
  getLink: (state) => (id) => {
    return state.links[id]
  },
};

const mutations = {
  setLink: (state, {id, elementId}) => {
    state.links[id] = elementId
  },
};

const actions = {
  actionSetLink: ({commit}, payload) => {
    commit("setLink", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
