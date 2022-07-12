import Vue from "vue"

const state = {
  columns: [],
  columnsValues: {},
  columnsIds: {},
};

const getters = {
  getColumn: (state) => (id) => {
    return state.columns.find(item => {
      return item.id == id
    })
  },
  getColumns: (state) => {
    return state.columns
  },
  getColumnValue: (state) => (id) => {
    return state.columnsValues[id]
  },
  getColumnsByParent: (state) => (parentId) => {
    return state.columns.filter(item => {
      return item.parentId == parentId
    })
  },
};

const mutations = {
  setColumn: (state, {id, label, parentId, tableId, defaultValue}) => {
    let index = state.columns.findIndex(item => item.id == id)
    let item = {id, label, parentId, tableId, defaultValue}
    if (index == -1) {
      state.columns.push(item)
      Vue.set(state.columnsValues, id, !!defaultValue)
    } else {
      let equal = Object.keys(item).every(key => {
        return state.columns[index][key] === item[key]
      })
      if (!equal) {
        Vue.set(state.columns, index, item)
        Vue.set(state.columnsValues, id, !!defaultValue)
      }
    }
  },
  setColumnsIds: (state, {tableId, columnsIds}) => {
    state.columnsIds[tableId] = columnsIds
  },
  unsetColumns: (state, {tableId, columnsIds}) => {
    let cond1 = state.columnsIds[tableId] && columnsIds.length == state.columnsIds[tableId].length
    let cond2 = cond1 && columnsIds.every(item => state.columnsIds[tableId].includes(item))
    let cond = !cond1 || !cond2
    if (cond) {
      state.columnsIds[tableId] = columnsIds
      let columns = state.columns.filter(item => item.tableId != tableId)
      state.columns = columns
      let columnsValues = {}
      columns.forEach(item => {
        columnsValues[item.id] = state.columnsValues[item.id]
      })
      state.columnsValues = columnsValues
    }
  },
  setColumnValue: (state, {id, value}) => {
    if (state.columnsValues[id] != value) {
      Vue.set(state.columnsValues, id, value)
    }
  },
};

const actions = {
  actionSetColumn: ({commit}, payload) => {
    commit("setColumn", payload);
  },
  actionUnsetColumns: ({commit}, payload) => {
    commit("unsetColumns", payload);
  },
  actionSetColumnsIds: ({commit}, payload) => {
    commit("setColumnsIds", payload);
  },
  actionSetColumnValue: ({commit}, payload) => {
    commit("setColumnValue", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
