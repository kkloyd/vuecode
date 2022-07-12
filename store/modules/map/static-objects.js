import Vue from "vue"
import {deepClone} from "@/lib/utils"

const state = {
  objects: {},
};

const getters = {
  getObjects: (state) => {
    return deepClone(state.objects)
  },
  getObjectsByType: (state) => (type) => {
    return deepClone(state.objects[type])
  },
  getIdsByType: (state) => (type) => {
    let object = deepClone(state.objects[type])
    if (!object || !object.items) return []
    return object.items.map(item => item.id)
  },
};

const mutations = {
  setObjects: (state, {type, data}) => {
    Vue.set(state.objects, type, data)
  },
  unsetObjects: (state, {type}) => {
    let objects = deepClone(state.objects)
    delete objects[type]
    state.objects = objects
  },
  unsetObject: (state, {type, id}) => {
    let objects = deepClone(state.objects)
    objects[type].items = objects[type].items.filter(item => item.id != id)
    Vue.set(state.objects, type, objects[type])
  },
  clear: (state) => {
    state.objects = {}
  },
};

const actions = {
  actionSetObjects({commit}, payload) {
    commit("setObjects", payload);
  },
  actionUnsetObjects({commit}, payload) {
    commit("unsetObjects", payload);
  },
  actionUnsetObject({commit}, payload) {
    commit("unsetObject", payload);
  },
  actionClear({commit}) {
    commit("clear");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
