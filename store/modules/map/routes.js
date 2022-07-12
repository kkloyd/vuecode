import togeojson from "@mapbox/togeojson"

const state = {
  routeId: null,
  routes: [],
  selectedPath: null,
  selectedPathTransfers: [],
  routePolylineEditor: {
    isVisible: false,
    polylineId: null
  },
}

const getters = {
  getRouteId: (state) => {
    return state.routeId
  },
  getRoutes: (state) => {
    return state.routes
  },
  getSelectedPath: (state) => {
    return state.selectedPath
  },
  getSelectedPathTransfers: (state) => {
    return state.selectedPathTransfers
  },
  getRoutePolylineEditor: (state) => {
    return state.routePolylineEditor
  }

};

const mutations = {
  setSelectedPath: (state, payload) => {
    state.selectedPath = payload
  },
  unsetSelectedPath: (state) => {
    state.selectedPath = null
  },
  setRouteId: (state, payload) => {
    state.routeId = payload
  },
  unsetRouteId: (state) => {
    state.routeId = null
  },
  addRoute: (state, payload) => {
    try {
      let kmlXML = new DOMParser().parseFromString(payload.kml, "application/xml");
      let geojson = togeojson.kml(kmlXML)
      payload.latlng = geojson.features[0].geometry.coordinates.map(item => item.reverse())
    } catch (e) {
      payload.latlng = []
    }
    let index = state.routes.findIndex(item => item.id === payload.id)
    if (index !== -1) {
      state.routes.splice(index, 1)
    }
    state.routes.push(payload)
  },
  removeRoute: (state, {id}) => {
    state.routes = state.routes.filter(item => item.id !== id)
  },
  clearRoutes: (state) => {
    state.routes = []
  },
  setSelectedPathTransfers: (state, payload) => {
    state.selectedPathTransfers = payload
  },
  clearSelectedPathTransfers: (state) => {
    state.selectedPathTransfers = []
  },
  setRoutePolylineEditor: (state, payload) => {
    state.routePolylineEditor = {...payload}
  }
};

const actions = {
  actionSetSelectedPath({commit}, payload) {
    commit("setSelectedPath", payload);
  },
  actionSetRouteId({commit}, payload) {
    commit("setRouteId", payload);
  },
  actionUnsetRouteId({commit}) {
    commit("unsetRouteId");
  },
  actionAddRoute({commit}, payload) {
    commit("addRoute", payload);
  },
  actionRemoveRoute({commit}, payload) {
    commit("removeRoute", payload);
  },
  actionSetSelectedPathTransfers({commit}, payload) {
    commit("setSelectedPathTransfers", payload)
  },
  actionClearSelectedPathTransfers({commit}) {
    commit("clearSelectedPathTransfers")
  },
  actionSetRoutePolylineEditor({commit}, payload) {
    commit("setRoutePolylineEditor", payload)
  },
  actionClearRoutes({commit}) {
    commit("clearRoutes");
  },
  actionClear({commit}) {
    commit("unsetRouteId");
    commit("clearRoutes");
    commit("unsetSelectedPath");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
