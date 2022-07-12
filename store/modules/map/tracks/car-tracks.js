import Vue from "vue"
import {deepClone} from "@/lib/utils"
import http from "@/services/http"

const state = {
  tracks: [],
  loading: {},
  loadingUniq: {},
  showTrackOnLoad: false,
  count: 0,
  isPolylineDecoratorsEnabled: false,
}

const getters = {
  getTrack: (state) => (id) => {
    let index = state.tracks.findIndex(item => item.id == id)
    if (index !== -1) {
      return deepClone(state.tracks[index])
    } else {
      return null
    }
  },
  hasTrack: (state) => (id) => {
    let index = state.tracks.findIndex(item => item.id == id)
    return index !== -1
  },
  getTracks: (state) => {
    return deepClone(state.tracks)
  },
  getTrackLoading: (state) => (id) => {
    return state.loading[id]
  },
  getShowTrackOnLoad: (state) => {
    return state.showTrackOnLoad
  },
  getIsPolylineDecoratorsEnabled: (state) => {
    return state.isPolylineDecoratorsEnabled
  }
};

const mutations = {
  addTrack: (state, payload) => {
    try {
      payload.track = Object.freeze(JSON.parse(payload.track))
    } catch (e) {}
    state.tracks.push(payload)
  },
  removeTrack: (state, id) => {
    let index = state.tracks.findIndex(item => item.id == id)
    if (index !== -1) {
      state.tracks.splice(index, 1)
    }
  },
  clearTracks: (state) => {
    state.tracks = []
  },
  setTrackLoading: (state, {id, loading}) => {
    Vue.set(state.loading, id, loading)
  },
  removeTrackLoading: (state, id) => {
    let loading = deepClone(state.loading)
    delete loading[id]
    state.loading = loading
  },
  clearTracksLoading: (state) => {
    state.loading = {}
  },
  setTrackLoadingCount: (state, {id}) => {
    state.count += 1
    Vue.set(state.loadingUniq, id, state.count)
  },
  removeTrackLoadingCount: (state, id) => {
    let loadingUniq = deepClone(state.loadingUniq)
    delete loadingUniq[id]
    state.loadingUniq = loadingUniq
  },
  clearTracksLoadingCount: (state) => {
    state.loadingUniq = {}
  },
  setShowTrackOnLoad: (state, payload) => {
    state.showTrackOnLoad = payload
  },
  setIsPolylineDecoratorsEnabled: (state, bool) => {
    state.isPolylineDecoratorsEnabled = bool
  }
};

const actions = {
  async actionAddTrack({state, commit, getters}, payload) {
    if (!state.loading[payload.id] && !getters.getTrack(payload.id)) {
      commit("setTrackLoading", {id: payload.id, loading: true});
      commit("setTrackLoadingCount", {id: payload.id});
      let loadingUniq = deepClone(state.loadingUniq)[payload.id]
      let data
      try {
        data = await getTrack(payload)
      } catch (e) {}
      if (state.loading[payload.id] && loadingUniq === state.loadingUniq[payload.id]) {
        if (data && data.length) {
          if (!payload.extraData) payload.extraData = {}
          commit("addTrack", {id: payload.id, ...data[0], color: payload.color, ...payload.extraData});
          commit("setTrackLoading", {id: payload.id, loading: false});
        } else {
          commit("removeTrackLoading", payload.id);
        }
        commit("removeTrackLoadingCount", payload.id);
      }
    }
  },
  actionAddOverdriveTrack({state, commit, getters}, payload) {
    const overdriveIntervals = payload.data.overdriveIntervals
    const notOverdriveIntervals = payload.data.notOverdriveIntervals
    const carTrackDto = payload.data.carTrackDto

    const carId = carTrackDto.carId
    if (!state.loading[carId] && !getters.getTrack(carId)) {
      commit("setTrackLoading", {id: carId, loading: true})
      commit("setTrackLoadingCount", {id: carId})
      let loadingUniq = deepClone(state.loadingUniq)[carId]
      if (state.loading[carId] && loadingUniq === state.loadingUniq[carId]) {
        if (carTrackDto) {
          notOverdriveIntervals.forEach(t => {
            commit("addTrack", {id: carId, ...carTrackDto, track: t, color: payload.color, noTrackData: true})
          })
          commit("setTrackLoading", {id: carId, loading: false})
        } else {
          commit("removeTrackLoading", carId)
        }
        commit("removeTrackLoadingCount", carId)
      }
    }
    if (overdriveIntervals && overdriveIntervals.length) {
      overdriveIntervals.forEach(t => {
        commit("addTrack", {id: payload.id, track: t, overdrive: true, color: "yellow"})
      })
    }
  },
  actionRemoveTrack({commit}, id) {
    commit("removeTrack", id);
    commit("removeTrackLoading", id);
    commit("removeTrackLoadingCount", id);
  },
  actionClearTracks({commit}) {
    commit("clearTracks");
    commit("clearTracksLoading");
    commit("clearTracksLoadingCount");
    commit("setShowTrackOnLoad", false);
  },
  actionShowTrackOnLoad({commit}, payload) {
    commit("setShowTrackOnLoad", payload);
  },
  actionSetIsPolylineDecoratorsEnabled({commit}, payload) {
    commit("setIsPolylineDecoratorsEnabled", payload)
  }
};

function getTrack({body}) {
  return http.post("carTracks", body)
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
