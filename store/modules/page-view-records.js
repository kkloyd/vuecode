import Auth from "@/services/Auth"
import moment from "moment"
import {post} from "@/api/pageviewrecords"

const state = {
  records: [],
  flushed: false,
};

const getters = {
  getRecords: (state) => {
    return state.records.slice(0, -1)
  },
};

const mutations = {
  setRecordDuration: (state, payload) => {
    let last = state.records.length - 1
    if (last >= 0) {
      state.records[last].duration = moment(payload.date, "YYYY-MM-DDTHH:mm:ss")
        .diff(moment(state.records[last].date, "YYYY-MM-DDTHH:mm:ss"), "seconds")
    }
  },
  setRecord: (state, payload) => {
    let url = payload.to
    let record = {
      url,
      title: payload.title,
      module: getModuleName(url),
      category: getSectionName(url),
      duration: 0,
      date: payload.date,
    }
    state.records.push(record)
  },
  clear: (state) => {
    state.records = state.records.slice(-1)
  },
  saveRecords: (state) => {
    localStorage.setItem("page-view-records", JSON.stringify(state.records))
  },
};

const actions = {
  actionFlush: ({state}) => {
    if (!state.flushed) {
      state.flushed = true
      let records = JSON.parse(localStorage.getItem("page-view-records")) || []
      records = records.filter(item => item.duration >= 3)
      if (records.length) {
        post(records)
      }
    }
  },
  actionSendStatistics: ({dispatch, getters}) => {
    let records = getters.getRecords.filter(item => item.duration >= 3)
    if (records.length) {
      post(records)
        .then(() => {
          dispatch("actionClear")
        })
    }
  },
  actionSetRecord: ({commit, dispatch}, payload) => {
    if (Auth.isUser() === true) {
      dispatch("actionFlush")
      if (payload.title && payload.title != "Agrostream") {
        let date = moment().format("YYYY-MM-DDTHH:mm:ss")
        commit("setRecordDuration", {date})
        commit("setRecord", {...payload, date})
        commit("saveRecords")
      }
    }
  },
  actionSetRecordDuration: ({commit}) => {
    let date = moment().format("YYYY-MM-DDTHH:mm:ss")
    commit("setRecordDuration", {date})
    commit("saveRecords")
  },
  actionClear: ({commit}) => {
    commit("clear")
    commit("saveRecords")
  },
};

import {modules} from "@/modules.js"

function getModuleName(url) {
  let key = url.split("/")[1] || ""
  return key && modules[key]
}
function getSectionName(url) {
  let moduleKey = url.split("/")[1] || ""
  let sectionKey = url.split("/")[2] || ""
  return moduleKey && sectionKey && {
    "admin": {
      "management": "Управление",
      "user": "Пользователь",
      "monitoring": "Мониторинг",
      "jobs": "Работа GPS",
      "map": "Карта",
    },
    "agrofact": {
      "catalog": "Справочники",
      "assignments": "Задания",
      "map": "Карта",
      "monitoring": "Мониторинг",
      "reports": "Отчеты",
      "help": "Помощь",
    },
    "agromap": {
      "notepad": "Мониторинг",
      "field": "Поле",
    },
    "agroplan": {
      "catalog": "Справочники",
      "sowings": "Посев",
      "works": "Работы",
      "map": "Карта",
      "reports": "Отчеты",
      "help": "Помощь",
    },
    "grainbalance": {
      "catalog": "Справочники",
      "parttime": "Подработка",
      "uchet": "Учет",
      "map": "Карта",
      "monitoring": "Мониторинг",
      "reports": "Отчеты",
      "help": "Помощь",
    },
  }[moduleKey][sectionKey]
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
