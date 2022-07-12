function initialState() {
  return {
    type: "default",
    value: null,
    cartype: null,
    sensorType: null,
    orgId: null,
    options: null,
    objectsOverlay: false,
    shrinkFieldMassiveType: {}
  }
}

const state = {
  ...initialState(),
};

const getters = {
  getData: (state) => {
    return {
      type: state.type,
      value: state.value,
      cartype: state.cartype,
      sensorType: state.sensorType,
      orgId: state.orgId,
      options: state.options
    }
  },
  getType: (state) => {
    return state.type
  },
  getValue: (state) => {
    return state.value
  },
  getCartype: (state) => {
    return state.cartype
  },
  getOrgId: (state) => {
    return state.orgId
  },
  getOptions: (state) => {
    return state.options
  },
  getObjectsOverlay: (state) => {
    return state.objectsOverlay
  },
  getShrinkFieldMassiveType: (state) => {
    return state.shrinkFieldMassiveType
  }
};

const mutations = {
  setFilter: (state, {type, value, cartype = null, sensorType = null, orgId = null, options = null}) => {
    state.type = type ? type : initialState().type
    state.value = value
    state.cartype = cartype
    state.orgId = orgId
    state.sensorType = sensorType
    state.options = options
  },
  setObjectsOverlay: (state, payload) => {
    state.objectsOverlay = payload
  },
  shrinkFieldMassiveType: (state, payload) => {
    state.shrinkFieldMassiveType = payload
  },
  reset: (state) => {
    const iState = initialState()
    Object.keys(iState).forEach(key => {
      state[key] = iState[key]
    })
  },
};

const actions = {
  actionSetFilter: ({commit}, payload) => {
    commit("setFilter", payload);
  },
  actionSetObjectsOverlay: ({commit}, payload) => {
    commit("setObjectsOverlay", payload)
  },
  actionShrinkFieldMassiveType: ({commit}, payload) => {
    commit("shrinkFieldMassiveType", payload)
  },
  actionReset: ({commit}) => {
    commit("reset");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
