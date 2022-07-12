import {deepClone} from "@/lib/utils"
import moment from "moment"
import randomcolor from "randomcolor";

const state = {
  realtimeStatus: false,
  cars: [],
  currentCar: null,
  filterCarTypes: [],
  carsAssigments: {},
  carsLastTracks: {}
}

const getters = {
  getCars: (state) => {
    return deepClone(state.cars)
  },
  getCarsAssigments: (state) => {
    return deepClone(state.carsAssigments)
  },
  getCarsLastTracks: (state) => {
    return state.carsLastTracks
  },
  getCurrentCar: state => {
    return state.currentCar
  },
  getRealtimeStatus: state => {
    return state.realtimeStatus
  },
  getFilterCarTypes: state => {
    return state.filterCarTypes
  }
}

const mutations = {
  setRealtimeStatus: (state, payload) => {
    state.realtimeStatus = payload
  },
  setFilterCarTypes: (state, payload) => {
    state.filterCarTypes = payload
  },
  addCarsAssigments: (state, payload) => {
    state.carsAssigments = deepClone(payload)
  },
  addCarsLastTracks: (state, payload) => {
    state.carsLastTracks = deepClone({...state.carsLastTracks, ...payload})
    let cars = state.cars
    for (let i = 0; i < cars.length; i++) {
      if (state.cars[i].carId in state.carsLastTracks && cars[i].gpsMessage.gpsPoint) {
        if (cars[i].gpsMessage.gpsPoint.latitude === cars[i].gpsMessage.gpsPointLast.latitude
          && cars[i].gpsMessage.gpsPoint.longitude === cars[i].gpsMessage.gpsPointLast.longitude
          || Object.keys(cars[i].gpsMessage.gpsPointLast).length === 0
        ) {
          let lastTrackPoint = state.carsLastTracks[cars[i].carId].track
          cars[i].gpsMessage.gpsPointLast.latitude = lastTrackPoint[lastTrackPoint.length - 1][0]
          cars[i].gpsMessage.gpsPointLast.longitude = lastTrackPoint[lastTrackPoint.length - 1][1]

        }
      }
    }
    state.cars = deepClone(cars)
  },
  addCar: (state, payload) => {
    function addCoordsTrack(car) {
      if (payload.carId in state.carsLastTracks && car) {
        state.carsLastTracks[payload.carId].lastSync = state.carsLastTracks[payload.carId].lastSync ? state.carsLastTracks[payload.carId].lastSync : moment()
        const diff = moment().diff(moment(state.carsLastTracks[payload.carId].lastSync), "minutes")
        if (diff > 15) {
          state.carsLastTracks[payload.carId].track = state.carsLastTracks[payload.carId].track.filter(t => moment().diff(t[3], "minutes") > 30)
          state.carsLastTracks[payload.carId].lastSync = moment()
        }
        const payloadLatLng = payload.gpsMessage.gpsPoint
        const track = state.carsLastTracks[payload.carId].track
        if (payloadLatLng.latitude && (track && track.length > 0 && track[track.length - 1] && (track[track.length - 1][0] !== payloadLatLng.latitude || track[track.length - 1][1] !== payloadLatLng.longitude)) ) {
          state.carsLastTracks[payload.carId].track.push([
            payloadLatLng.latitude,
            payloadLatLng.longitude,
            car.gpsMessage.speed,
            car.gpsMessage.time
          ])
        }
      }
      else if (car && car.gpsMessage.gpsPoint && !state.carsLastTracks[car.carId]) {
        state.carsLastTracks[car.carId] = {
          carId: car.carId,
          carTrackColor: randomcolor({
            luminosity: "bright",
            hue: ["#27AE60", "#F1C40F", "#8E44AD", "#2980B9", "#2C3E50", "#FDA7DF", "#BDC581", "#E77F67", "#82CCDD", "#FFF200"][Math.floor(Math.random() * 10)]
          }),
          lastSync: moment(car.gpsMessage.time, "YYYY-MM-DDTHH:mm:ss"),
          track: [[
            car.gpsMessage.gpsPoint.latitude,
            car.gpsMessage.gpsPoint.longitude,
            car.gpsMessage.speed,
            car.gpsMessage.time
          ]]
        }
      }
    }
    if (payload && payload.carId) {
      let car, carIndex
      state.cars.forEach((o, i) => {
        if (o.carId === payload.carId) {
          car = o
          carIndex = i
        }
      })
      if (!payload.gpsMessage) payload.gpsMessage = {}
      if (!car) {
        addCoordsTrack(payload)
        payload.gpsMessage.gpsPointLast = {}
        state.cars.push(payload)
      }
      else {
        addCoordsTrack(car)
        let latlng = car.gpsMessage && car.gpsMessage.gpsPoint ? car.gpsMessage.gpsPoint : {}
        let latlngLast = car.gpsMessage && car.gpsMessage.gpsPointLast ? car.gpsMessage.gpsPointLast : {}
        if (payload.gpsMessage && payload.gpsMessage.gpsPoint && (payload.gpsMessage.gpsPoint.latitude !== latlng.latitude || payload.gpsMessage.gpsPoint.longitude !== latlng.longitude)) {
          latlng = deepClone(latlng)
        }
        else if (latlngLast.latitude && latlngLast.longitude && (latlng.latitude !== latlngLast.latitude || latlng.longitude !== latlngLast.longitude)) {
          latlng = deepClone(latlngLast)
        }
        if (!latlngLast.longitude && car.carId in state.carsLastTracks && state.carsLastTracks[car.carId].track.length > 0) {
          let lastTrackPoint = state.carsLastTracks[car.carId].track
          latlng.latitude = lastTrackPoint[lastTrackPoint.length - 1][0]
          latlng.longitude = lastTrackPoint[lastTrackPoint.length - 1][1]
        }
        payload.gpsMessage.gpsPointLast = deepClone(latlng)
        state.cars.splice(carIndex, 1, payload)
      }
    }
  },
  removeCars: (state, arr) => {
    state.cars = state.cars.filter(o => !arr.includes(o.carId))
  },
  removeCarTracks: (state, arr) => {
    for (let i = 0; i < arr; i++) {
      delete state.carsLastTracks[arr[i]]
    }
  },
  clearCars: (state) => {
    state.cars = []
  },
  setCurrentCar: (state, payload) => {
    state.currentCar = payload
  },
  resetCurrentCar: (state) => {
    state.currentCar = null
  },
  clearAll: (state) => {
    state.cars = []
    state.currentCar = null
    state.carsAssigments = {}
    state.carsLastTracks = {}
  }
};

const actions = {
  actionSetRealtimeStatus({commit}, payload) {
    commit("setRealtimeStatus", payload)
  },
  actionSetFilterCarTypes({commit}, payload) {
    commit("setFilterCarTypes", payload)
  },
  actionAddCar({commit}, payload) {
    commit("addCar", payload)
  },
  actionAddAssigments({commit}, payload) {
    commit("addCarsAssigments", payload)
  },
  actionAddCarsLastTracks({commit}, payload) {
    commit("addCarsLastTracks", payload)
  },
  actionRemoveCars({commit}, payload) {
    commit("removeCars", payload)
  },
  actionRemoveCarTracks({commit}, payload) {
    commit("removeCarTracks", payload)
  },
  actionClearCars({commit}) {
    commit("clearCars")
  },
  actionSetCurrentCar({commit}, payload) {
    commit("setCurrentCar", payload)
  },
  actionResetCurrentCar({commit}) {
    commit("resetCurrentCar")
  },
  actionClear({commit}) {
    commit("clearAll")
  },
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
