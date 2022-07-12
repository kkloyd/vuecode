import Vue from "vue"
import {deepClone} from "@/lib/utils"
import http from "@/services/http"

const state = {
  stops: [],
  loading: {},
  loadingUniq: {},
  showStopOnLoad: false,
  count: 0,
}

const getters = {
  getStop: (state) => (id) => {
    let index = state.stops.findIndex(item => item.id == id)
    if (index !== -1) {
      return deepClone(state.stops[index])
    } else {
      return null
    }
  },
  getStops: (state) => {
    return deepClone(state.stops)
  },
  getShowStopOnLoad: (state) => {
    return state.showStopOnLoad
  },
};

const mutations = {
  addStop: (state, payload) => {
    try {
      payload.stop = Object.freeze(JSON.parse(payload.stop))
    } catch (e) {}
    state.stops.push(payload)
  },
  clearStops: (state) => {
    state.stops = []
  },
  setStopLoading: (state, {id, loading}) => {
    Vue.set(state.loading, id, loading)
  },
  removeStopLoading: (state, id) => {
    let loading = deepClone(state.loading)
    delete loading[id]
    state.loading = loading
  },
  clearStopsLoading: (state) => {
    state.loading = {}
  },
  setStopLoadingCount: (state, {id}) => {
    state.count += 1
    Vue.set(state.loadingUniq, id, state.count)
  },
  removeStopLoadingCount: (state, id) => {
    let loadingUniq = deepClone(state.loadingUniq)
    delete loadingUniq[id]
    state.loadingUniq = loadingUniq
  },
  clearStopsLoadingCount: (state) => {
    state.loadingUniq = {}
  },
  setShowStopOnLoad: (state, payload) => {
    state.showStopOnLoad = payload
  },
};

const actions = {
  async actionAddStop({state, commit, getters}, payload) {
    if (!state.loading[payload.id] && !getters.getStop(payload.id)) {
      commit("setStopLoading", {id: payload.id, loading: true});
      commit("setStopLoadingCount", {id: payload.id});
      let loadingUniq = deepClone(state.loadingUniq)[payload.id]
      let data
      try {
        data = await getStops(payload.id)
      } catch (e) {}
      if (state.loading[payload.id] && loadingUniq === state.loadingUniq[payload.id]) {
        if (data && data.length) {
          data.forEach(s => {
            commit("addStop", {id: payload.id, ...s})
          })
          commit("setStopLoading", {id: payload.id, loading: false});
        } else {
          commit("removeStopLoading", payload.id);
        }
        commit("removeStopLoadingCount", payload.id);
      }
    }
  },
  actionClearStops({commit}) {
    commit("clearStops");
    commit("clearStopsLoading");
    commit("clearStopsLoadingCount");
    commit("setShowStopOnLoad", false);
  },
};


function getStops(reportId) {
  return http.get(`transportationReport/getStops/${reportId}`)
    .then((data) => {
      return data
    })
    .catch((e) => {
      throw e;
    })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
