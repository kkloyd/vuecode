import Vue from "vue"
import {deepClone} from "@/lib/utils"
import localforage from "localforage"
import http from "@/services/http"

import {store} from "@/store"
import moment from "moment"

const state = {
  tracks: [],
  loading: {},
  color: {},
  isViolationTracksEnabled: false
};

const getters = {
  getTrack: (state) => (id) => {
    let index = state.tracks.findIndex(item => item.assignmentId === id)
    if (index !== -1) {
      return deepClone(state.tracks[index])
    } else {
      return null
    }
  },
  hasTrack: (state) => (id) => {
    let index = state.tracks.findIndex(item => item.assignmentId === id)
    return index !== -1
  },
  getTracks: (state) => {
    return state.tracks
  },
  getTrackLoading: (state) => (id) => {
    return state.loading[id]
  },
  getTrackColor: (state) => (id) => {
    return state.color[id]
  },
  getIsViolationTracksEnabled: (state) => {
    return state.isViolationTracksEnabled
  }
};

const mutations = {
  addTrack: (state, payload) => {
    try {
      payload.track = Object.freeze(JSON.parse(payload.track))
    } catch (e) {}
    state.tracks.push(payload)
  },
  addTracks: (state, {data, organizationId, nometa = false, saveToStorage = true}) => {
    try {
      let contextYear = store.getters["Contexts/getContexts"].year
      if (contextYear > 2021) {
        data.forEach(item => {
          item.nometa = nometa
          item.trackFormat = 0
          item.assignmentId = item.aId
          item.track = item.tr
          if (item.tr.length) {
            state.tracks.push(item)
            let body = {
              data: {
                data: item,
              },
            }
            if (saveToStorage) {
              let contextYear = store.getters["Contexts/getContexts"].year
              localforage.setItem(`${SERVER_API_URL}api/leafletTracks/${organizationId}/${item.aId}?year=${contextYear}`, body)
            }
          }
        })
      } else {
        data.forEach(item => {
          item.nometa = nometa
          item.track = Object.freeze(JSON.parse(item.track))
          if (item.track.length) {
            state.tracks.push(item)
            let body = {
              data: {
                data: item,
              },
            }
            if (saveToStorage) {
              let contextYear = store.getters["Contexts/getContexts"].year
              localforage.setItem(`${SERVER_API_URL}api/leafletTracks/${organizationId}/${item.assignmentId}?year=${contextYear}`, body)
            }
          }
        })
      }
    } catch (e) {}
  },
  addSimpleTracks: (state, {data, organizationId}) => {
    try {
      data.forEach(item => {
        item.track = Object.freeze(JSON.parse(item.track))
        if (item.track.length) {
          state.simpletracks.push(item)
          let body = {
            data: {
              data: item,
            },
          }
          let contextYear = store.getters["Contexts/getContexts"].year
          localforage.setItem(`${SERVER_API_URL}api/leafletTracks/${organizationId}/${item.assignmentId}?year=${contextYear}`, body)
        }
      })
    } catch (e) {}
  },
  removeTrack: (state, id) => {
    state.tracks = state.tracks.filter(item => item.assignmentId !== id)
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
  setTrackColor: (state, {id, color}) => {
    Vue.set(state.color, id, color)
  },
  removeTrackColor: (state, id) => {
    let color = deepClone(state.color)
    delete color[id]
    state.color = color
  },
  clearTracksColor: (state) => {
    state.color = {}
  },
  setIsViolationTracksEnabled: (state, bool) => {
    state.isViolationTracksEnabled = bool
  }
};

const actions = {
  async actionAddTrack({state, commit, getters}, payload) {
    if (!state.loading[payload.id] && !getters.getTrack(payload.id)) {
      commit("setTrackLoading", {id: payload.id, loading: true});
      let data
      try {
        data = await getTrack(payload)
      } catch (e) {}
      if (state.loading[payload.id]) {
        if (data && data.track && data.track !== "[]") {
          commit("addTrack", data);
          commit("setTrackLoading", {id: payload.id, loading: false});
        } else {
          commit("removeTrackLoading", payload.id);
        }
      }
    }
  },
  async actionAddTracks({state, dispatch, commit, getters}, payload) {
    payload.ids = payload.ids.filter(id => !state.loading[id] && !getters.getTrack(id))
    payload.ids.forEach(id => {
      commit("setTrackLoading", {id, loading: true});
    })
    let trackIdsFromStorage = await getTrackIdsFromStorage(payload.organization)
    trackIdsFromStorage = trackIdsFromStorage.filter(id => payload.ids.includes(id))
    dispatch("actionAddTracksFromStorage", {trackIdsFromStorage, organizationId: payload.organization})
    payload.ids = payload.ids.filter(id => !trackIdsFromStorage.includes(id))
    if (payload.ids.length) {
      let data
      try {
        data = await getTracks(payload)
      } catch (e) {}
      if (data) {
        let contextYear = store.getters["Contexts/getContexts"].year
        if (contextYear > 2021) {
          data = data.filter(item => state.loading[item.aId])
        } else {
          data = data.filter(item => state.loading[item.assignmentId])
        }
        if (data.length) {
          commit("addTracks", {data, organizationId: payload.organization});
          data.forEach(item => {
            commit("setTrackLoading", {id: item.assignmentId, loading: false});
          })
        } else {
          data.forEach(item => {
            commit("removeTrackLoading", item.assignmentId);
          })
        }
      }
    }
  },
  async actionAddSimpleTracksWithData({state, dispatch, commit, getters}, payload) {
    payload.ids = payload.ids.filter(id => !state.loading[id] && !getters.getTrack(id))
    payload.ids.forEach(id => {
      commit("setTrackLoading", {id, loading: true});
    })
    if (payload.ids.length) {
      const data = payload.data
      if (data.length) {
        const filtered = data.filter(item => state.loading[item.assignmentId])
        if (filtered.length) {
          commit("addTracks", {data: filtered, organizationId: payload.organization, nometa: true, saveToStorage: false});
          filtered.forEach(item => {
            commit("setTrackLoading", {id: item.assignmentId, loading: false});
          })
        } else {
          filtered.forEach(item => {
            commit("removeTrackLoading", item.assignmentId);
          })
        }
      }
    }
  },
  async actionAddTracksFromStorage({state, commit}, {trackIdsFromStorage, organizationId}) {
    try {
      let tracksPromises = trackIdsFromStorage.map(async id => {
        let contextYear = store.getters["Contexts/getContexts"].year
        let item = await localforage.getItem(`${SERVER_API_URL}api/leafletTracks/${organizationId}/${id}?year=${contextYear}`)
        return item.data.data
      })
      let tracks = []
      for (const tracksPromise of tracksPromises) {
        let item = await tracksPromise
        tracks.push(item)
      }
      tracks.forEach(item => {
        commit("setTrackLoading", {id: item.assignmentId, loading: false});
        item.track = typeof item.track == "string" ? Object.freeze(JSON.parse(item.track)) : Object.freeze(item.track)
        state.tracks.push(item)
      })
    } catch (e) {}
  },
  actionSetTrackColor({commit}, payload) {
    commit("setTrackColor", payload);
  },
  actionRemoveTrack({commit}, id) {
    commit("removeTrack", id);
    commit("removeTrackLoading", id);
    commit("removeTrackColor", id);
  },
  actionClearTracks({commit}) {
    commit("clearTracks");
    commit("clearTracksLoading");
    commit("clearTracksColor");
  },
  actionSetIsViolationTracksEnabled({commit}, payload) {
    commit("setIsViolationTracksEnabled", payload)
  }
};

function getTrack({id, organization}) {
  let contextYear = store.getters["Contexts/getContexts"].year
  let apiForNew = contextYear > 2021 ? `leafletTracks/getWithViolation/${id}?year=${contextYear}` : `leafletTracks/${organization}/${id}?year=${contextYear}`
  return http.getCache(apiForNew)
    .then((data) => {
      // data.tr.map(el => {
      //   el[3] = moment.utc(el[3]).format("YYYY-MM-DDTHH:mm:ss")
      // })
      if (contextYear > 2021) {
        data.assignmentId = data.aId
        data.track = data.tr
        return data
      }
      return data
    })
    .catch((e) => {
      throw e;
    })
}
function getTracks({assignments, organization}) {
  let contextYear = store.getters["Contexts/getContexts"].year
  if(contextYear > 2021){
    let apiAss = []
    assignments.forEach(el => {
      apiAss.push('assIds=' + el.id)
    })
    let api = `leafletTracks/getManyWithViolations?${apiAss.join("&")}&year=${contextYear}`
    return http.get(api)
      .then((data) => {
        return data
      })
      .catch((e) => {
        throw e;
      })
  }
  else{
    let body = {
      assignments,
      organizationId: organization,
      trackFormat: 0,
      year: contextYear
    }
    return http.post("leafletTracks/getmany", body)
    .then((data) => {
      return data
    })
    .catch((e) => {
      throw e;
    })
  }
}
async function getTrackIdsFromStorage(organizationId) {
  let keys = await localforage.keys()
  let ids = []
  keys.forEach(key => {
    let contextYear = store.getters["Contexts/getContexts"].year
    let str = `${SERVER_API_URL}api/leafletTracks/${organizationId}?year=${contextYear}`
    let index = key.indexOf(str)
    if (index === 0) {
      ids.push(+key.slice(str.length))
    }
  })
  return ids
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
