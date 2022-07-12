import http from "@/services/http"
import {store} from "@/store"
import moment from 'moment'

const state = {
  tracks: [],
  loading: false
}

const getters = {
  getAllTracks(state) {
    return state.tracks
  }
};

const mutations = {
  setTracks: (state, tracks) => {
    state.tracks = tracks
  },
};

const actions = {
  async actionGetWorkTracks({commit}, payload) {
    let subOperationId = payload
    let organizationId = store.getters["Contexts/getOrganization"]
    let date = moment(store.getters["Map/getMapDate"]).format("YYYY-MM-DD")
    let result = []
    if (subOperationId && !parseInt(subOperationId)) {
      let echelonType = subOperationId.split('-')[1]
      result = await getAllTracks({organizationId, echelonType, date})
    }
    else if (subOperationId) {
      result = await getTracks({organizationId, subOperationId, date})
    }
    commit("setTracks", result)

  },
  async actionGetWorkGroupTracks({commit}, payload) {
    let subOperationId = payload.subOperationId
    let date = moment(store.getters["Map/getMapDate"]).format("YYYY-MM-DD")
    let result = []
    payload.orgIds.forEach(element => {
      if (subOperationId && !parseInt(subOperationId)) {
        let echelonType = subOperationId.split('-')[1]
        return http.get(`GetAllTracks/${element}?date=${date}&echelonType=${echelonType}`)
        .then((data) => {
          result.push(data)
        })
        .catch((e) => {
          throw e;
        })
      }
      else if (subOperationId) {
        http.get(`GetAllTracksBySubOperation/${element}/${subOperationId}?date=${date}`)
        .then((data) => {
          result.push(data)
        })
        .catch((e) => {
          throw e;
        })
      }
    });

    commit("setTracks", result)

  },
};

function getTracks({organizationId, subOperationId, date}) {
  return http.get(`GetAllTracksBySubOperation/${organizationId}/${subOperationId}?date=${date}`)
    .then((data) => {
      return data
    })
    .catch((e) => {
      throw e;
    })
}

function getAllTracks({organizationId, echelonType, date}) {
  return http.get(`GetAllTracks/${organizationId}?date=${date}&echelonType=${echelonType}`)
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
