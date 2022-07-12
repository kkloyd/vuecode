import GlobalMethods from "@/lib/GlobalMethods"

const state = {
  contexts: {},
  organization: null,
  organizationsGroupId: null,
  organizationGuid: null,
  budget: null,
  year: null,
  field: null,
  startDateOfGrainBalance: null,
  endDateOfGrainBalance: null,
  echelonType: null,
  childOrganizationId: null,
}

const getters = {
  getContexts: (state) => {
    return state.contexts
  },
  getContext: (state) => (name) => {
    return state[name]
  },
  getOrganization: (state) => {
    return state.organization
  },
  getOrganizationsGroupId: (state) => {
    return state.organizationsGroupId
  },
  getOrganizationsGuid: (state) => {
    return state.organizationGuid
  },
  getBudget: (state) => {
    return state.budget
  },
  getYear: (state) => {
    return state.year
  },
  getField: (state) => {
    return state.field
  },
  getEchelonType: (state) => {
    return state.echelonType
  },
  getChildOrganizationId: (state) => {
    return state.childOrganizationId
  },
}

const mutations = {
  initContexts: (state) => {
    let contexts = JSON.parse(localStorage.getItem("contexts")) || {}
    state.contexts = contexts
    state.organization = contexts.organization
    state.organizationsGroupId = contexts.organizationsGroupId
    state.budget = contexts.budget
    state.year = contexts.year
    state.field = contexts.field
    state.echelonType = contexts.echelonType
  },
  setContext: (state, {name, val}) => {
    state[name] = val
    state.contexts[name] = val
  },
  saveContexts: (state) => {
    localStorage.setItem("contexts", JSON.stringify(state.contexts))
  },
  removeContexts: () => {
    localStorage.removeItem("contexts")
  },
  setOrganizationGuid: (state) => {
    state.organizationGuid = GlobalMethods.getOrganizationGuid()
  }
}

const actions = {
  actionInitContexts: ({commit, state, dispatch}) => {
    commit("initContexts")
  },
  actionSetContext: ({commit}, {name, val, reload, organizationTypeDiffer = false}) => {
    commit("setContext", {name, val})
    commit("saveContexts")
    if (reload) {
      if (organizationTypeDiffer) {
        window.location = "/"
      } else {
        window.location.reload(true)
      }
    }
  },
  actionRemoveContexts: ({commit}) => {
    commit("removeContexts")
  },
  actionSetOrganization: ({dispatch, getters}, {val, reload}) => {
    let organizationTypeDiffer = false
    if (getters.getOrganization !== val) {
      let organizationType = GlobalMethods.getOrganizationType(getters.getOrganization)
      let newOrganizationType = GlobalMethods.getOrganizationType(val)
      organizationTypeDiffer = organizationType !== newOrganizationType

      if (localStorage.getItem("pickedWarehouseIds")) {
        localStorage.removeItem("pickedWarehouseIds")
      }
    }


    dispatch("actionSetContext", {name: "organization", val, reload, organizationTypeDiffer})
  },
  actionSetOrganizationsGroupId: ({dispatch}, {val, reload}) => {
    dispatch("actionSetContext", {name: "organizationsGroupId", val, reload})
  },
  actionSetOrganizationGuid: ({commit}) => {
    commit("setOrganizationGuid")
  },
  actionSetBudget: ({dispatch}, {val, reload}) => {
    dispatch("actionSetContext", {name: "budget", val, reload})
  },
  actionSetYear: ({dispatch}, {val, reload}) => {
    dispatch("actionSetContext", {name: "year", val, reload})
  },
  actionSetField: ({dispatch}, {val, reload}) => {
    dispatch("actionSetContext", {name: "field", val, reload})
  },
  actionSetEchelonType: ({dispatch}, {val, reload}) => {
    dispatch("actionSetContext", {name: "echelonType", val, reload})
  },
  actionSetChildOrganizationId: ({dispatch}, {val, reload}) => {
    dispatch("actionSetContext", {name: "childOrganizationId", val, reload})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
