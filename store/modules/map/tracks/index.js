import AssignmentTracks from "./assignment-tracks";
import CarTracks from "./car-tracks";
import CarStops from "./car-stops";
import OperationTracks from "./operation-tracks"

const state = {
};

const getters = {
};

const mutations = {
};

const actions = {
  actionClearTracks({dispatch}) {
    dispatch("AssignmentTracks/actionClearTracks")
    dispatch("CarTracks/actionClearTracks")
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    AssignmentTracks,
    CarTracks,
    CarStops,
    OperationTracks
  },
}
