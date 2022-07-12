import localforage from "localforage";

const state = {
  formsDataInstance: null,
  item: null,
};

const getters = {
  getItem: (state) => {
    return state.item
  },
};

const mutations = {
  createInstance: (state) => {
    let formsDataInstance
    try {
      formsDataInstance = localforage.createInstance({storeName: "formsData"});
    } catch (e) {
    }
    state.formsDataInstance = formsDataInstance
  },
  setItem: (state, payload) => {
    state.item = payload
  },
};

const actions = {
  async actionInit({commit, dispatch}, payload) {
    commit("createInstance");
    await dispatch("actionPreloadItem", payload);
  },
  async actionPreloadItem({commit, state}, {id}) {
    await state.formsDataInstance.getItem(id)
      .then((item) => {
        commit("setItem", item);
      }).catch((e) => {
        commit("setItem", null);
        throw e
      });
  },
  actionSetItem({dispatch}, payload) {
    dispatch("actionSaveItem", payload)
  },
  actionSaveItem({commit, state}, {id, data}) {
    state.formsDataInstance.setItem(id, data)
      .then((item) => {
        commit("setItem", item);
      }).catch((e) => {
        commit("setItem", null);
        throw e
      });
  },
  async actionClear({commit, state}) {
    commit("createInstance");
    await state.formsDataInstance.clear()
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
