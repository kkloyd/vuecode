import Filter from "./filter";
import Tabs from "./tabs";
import Tracks from "./tracks";
import Routes from "./routes";
import Player from "./player";
import CarSensors from "./car-sensors";
import StaticObjects from "./static-objects";
import RealtimeObjects from "./realtime-objects";
import Overlays from "./overlays/index";
import PolylineMeasure from "./polyline-measure";
import ChemicalsFertilizers from "./chemicalsfertilizers"

function initialState() {
  return {
    editState: false,
    mapDate: null,
    mapDateRange: null,
  }
}

const state = {
  ...initialState(),
};

const getters = {
  getMapDate: (state) => {
    return state.mapDate
  },
  getMapDateRange: (state) => {
    return state.mapDateRange
  },
  getEditState: (state) => {
    return state.editState
  },
};

const mutations = {
  setMapDate: (state, payload) => {
    state.mapDate = payload
  },
  setMapDateRange: (state, payload) => {
    state.mapDateRange = payload
  },
  setEditState: (state, payload) => {
    state.editState = payload
  },
  clear: (state) => {
    const iState = initialState()
    Object.keys(iState).forEach(key => {
      state[key] = iState[key]
    })
  }
};

const actions = {
  actionSetMapDate: (context, payload) => {
    context.commit("setMapDate", payload);
  },
  actionSetMapDateRange: (context, payload) => {
    context.commit("setMapDateRange", payload);
  },
  actionSetEditState: (context, payload) => {
    context.commit("setEditState", payload);
  },
  actionClear: ({commit, dispatch}) => {
    commit("clear");
    dispatch("Tracks/actionClearTracks")
    dispatch("Routes/actionClear")
    dispatch("StaticObjects/actionClear")
    dispatch("RealtimeObjects/actionClear")
    dispatch("Tabs/actionReset")
    dispatch("Filter/actionReset")
    dispatch("Overlays/actionReset")
    dispatch("PolylineMeasure/actionReset")
    dispatch("ChemicalsFertilizers/actionClear")
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    Filter,
    Tabs,
    Tracks,
    Routes,
    Player,
    CarSensors,
    StaticObjects,
    RealtimeObjects,
    Overlays,
    PolylineMeasure,
    ChemicalsFertilizers,
  },
}
