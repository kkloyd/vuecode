const state = {
  queue: [],
  queueId: 0,
};

const getters = {
  getQueue: (state) => {
    return state.queue;
  },
  getQueueId: (state) => {
    return state.queueId;
  },
};

const mutations = {
  setQueue: (state, payload) => {
    state.queue = payload;
  },
  setQueueId: (state, payload) => {
    state.queueId = payload;
  },
};

const actions = {
  actionSetQueue: ({commit}, payload) => {
    commit("setQueue", payload);
  },
  actionSetQueueId: ({commit}, payload) => {
    commit("setQueueId", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
