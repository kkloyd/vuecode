import {create, SheetsManager} from "jss"
import preset from "jss-preset-default"

const jss = create(preset())
const manager = new SheetsManager()

const state = {
  keys: {},
};

const mutations = {
  attach: (state, {id, styles}) => {
    if (!state.keys[id] && Object.keys(styles).length) {
      const sheet = jss.createStyleSheet({"@global": styles})
      const key = {}
      manager.add(key, sheet)
      state.keys[id] = key
      manager.manage(key)
    }
  },
  detach: (state, {id}) => {
    const key = state.keys[id]
    if (key) {
      delete state.keys[id]
      manager.unmanage(key)
    }
  },
};

const actions = {
  actionAttach: ({commit}, payload) => {
    commit("attach", payload);
  },
  actionDetach: ({commit}, payload) => {
    commit("detach", payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
