import {deepClone} from "@/lib/utils"

/*
cartypes:
1 - Трактор
2 - Комбайн
3 - Легковой автомобиль
4 - Грузовой автомобиль
5 - Жатка самоходная
6 - Опрыскиватель
7 - Топливозаправщик
 */

const list = [
  {module: "agrofact", filter: {type: "default"}, id: "date-assignments", name: "Задания", defaultActive: true},

  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 5, 6]}, id: "car-assignments", name: "Задания", defaultActive: true},
  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 5, 6]}, id: "car-info", name: "Паспорт техники"},
  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 3, 4, 5, 6, 7], multiple: true}, id: "car-gps", name: "GPS"},
  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 3, 4, 5, 6, 7], multiple: true}, id: "realtime-gps", name: "Онлайн"},
  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 3, 4, 5, 6, 7]}, id: "car-sensors", name: "Датчики"},
  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 4], sensorType: 8}, id: "unloading-report", name: "Выгрузка"},
  {module: "agrofact", filter: {type: "car", cartypes: [1, 2, 4, 5, 6, 7]}, id: "daily-car-fuel", name: "ГСМ"},
  {module: "agrofact", filter: {type: "route"}, id: "transportation-route", name: "Транспортировка"},
  {module: "agrofact", filter: {type: "car", cartypes: [4]}, id: "transportation-truck", name: "Транспортировка"},

  {module: "agrofact", filter: {types: ["field", "seedlimit", "seedlimit-field"]}, id: "passport", name: "Паспорт поля", defaultActive: true},
  {module: "agrofact", filter: {types: ["field", "seedlimit", "seedlimit-field"]}, id: "crop-rotation", name: "Севооборот"},
  {module: "agrofact", filter: {types: ["field", "seedlimit", "seedlimit-field"]}, id: "soilresearches", name: "АХО"},
  {module: "agrofact", filter: {types: ["field", "seedlimit", "seedlimit-field"]}, id: "field-assignments", name: "Задания"},

  {module: "agrofact", filter: {type: "employee"}, id: "employee-assignments", name: "Задания", defaultActive: true},
  {module: "agrofact", overlay: "Карта удобрений", filter: {type: "fertilizers"}, id: "fertilizers", name: "Удобрения"},
  {module: "agrofact", overlay: "Карта СЗР", filter: {type: "chemicals"}, id: "chemicals", name: "СЗР", defaultActive: true},


  {module: "agroplan", overlay: "Карта посева", filter: {types: ["default", "field"]}, id: "sowings-chart", name: "Диаграмма"},
  {module: "agroplan", overlay: "Карта продуктивности", filter: {types: ["default", "field"]}, id: "field-scores-chart", name: "Диаграмма"},
  {module: "agroplan", overlay: "Карта земель", filter: {types: ["default", "field"]}, id: "field-types-chart", name: "Диаграмма"},
  {module: "agroplan", filter: {types: ["default", "field"]}, id: "passport", name: "Паспорт поля"},
  {module: "agroplan", filter: {types: ["default", "field"]}, id: "kadastr-passport", name: "Паспорт кадастра"},
  {module: "agroplan", filter: {types: ["default", "field"]}, id: "history", name: "История"},
  {module: "agroplan", filter: {types: ["default", "field"]}, id: "plan", name: "План", organizationTypes: [0]},


  {module: "admin", overlay: "Карта полей", filter: {types: ["default", "field"]}, id: "upload-kml", name: "Загрузка полигона", defaultActive: true},
  {module: "admin", overlay: "Карта полей", filter: {types: ["default", "field"]}, id: "field-assignments", name: "Редактирование полигона"},
  {module: "admin", overlay: "Карта полей", filter: {types: ["default", "field"]}, id: "upload-axo", name: "Загрузка АХО"},

  {module: "admin", overlay: "Карта транспортировки", filter: {type: "warehouse"}, id: "upload-warehouse-kml", name: "Загрузка полигона", defaultActive: true},
  {module: "admin", overlay: "Карта контрагентов", filter: {type: "contractor"}, id: "upload-contractor-kml", name: "Загрузка полигона", defaultActive: true},
  {module: "admin", overlay: "Карта направления", filter: {type: "massives"}, id: "massives", name: "Карта направления", defaultActive: true},
  {module: "admin", overlay: "Маршруты", filter: {types: ["route"]}, id: "route", name: "Маршруты", defaultActive: true},
  {module: "admin", overlay: "Маршруты", filter: {types: ["route"]}, id: "transfer", name: "Трансферы"},

  {module: "agromap", overlay: "Карта полей", filter: {types: ["default", "field"]}, id: "sowings-chart", name: "Диаграмма"},
  {module: "agromap", filter: {types: ["field"]}, id: "passport", name: "Паспорт поля", defaultActive: true},
  {module: "agromap", filter: {types: ["field"]}, id: "crop-rotation", name: "Севооборот"},
  {module: "agromap", filter: {types: ["field"]}, id: "soilresearches", name: "АХО"},


  {module: "grainbalance", filter: {type: "car"}, id: "car-gps", name: "GPS", defaultActive: true},

  {module: "grainbalance", filter: {type: "field"}, id: "passport", name: "Паспорт поля", defaultActive: true},
]

function initialState() {
  return {
    filteredList: [],
    active: null,
    height: 250,
    width: 330,
  }
}

const state = {
  ...initialState(),
};

const getters = {
  getList: (state) => {
    return state.filteredList
  },
  getActive: (state) => {
    return state.active
  },
  getHeight: (state) => {
    return state.height
  },
  getContentHeight: (state) => {
    return state.height - 26
  },
  getWidth: (state) => {
    return state.width
  },
  getContentWidth: (state) => {
    return state.width
  },
};

const mutations = {
  filter: (state, {type, value, cartype, sensorType, module = "agrofact", overlay, organizationType}) => {
    state.filteredList = deepClone(list)
      .filter(item => item.module == module)
      .filter(item => item.organizationTypes ? item.organizationTypes.includes(organizationType) : true)
      .filter(item => item.overlay ? item.overlay == overlay : true)
      .filter(item => {
        let cond1 = item.filter.type ? item.filter.type == type : item.filter.types.includes(type)
        let cond2 = item.filter.multiple || !Array.isArray(value)
        let cond3 = !cartype || !item.filter.cartypes || item.filter.cartypes.includes(cartype)
        let cond4 = !item.filter.sensorType || item.filter.sensorType === sensorType
        return cond1 && cond2 && cond3 && cond4
      })
  },
  setDefaultActive: (state) => {
    if (state.filteredList.length) {
      let index = state.filteredList.findIndex(item => item.id == state.active)
      if (index == -1) {
        index = state.filteredList.findIndex(item => item.defaultActive)
        state.active = index != -1 ? state.filteredList[index].id : state.filteredList[0].id
      }
    }
  },
  setActive: (state, payload) => {
    state.active = payload
  },
  setHeight: (state, payload) => {
    state.height = payload
  },
  setWidth: (state, payload) => {
    state.width = payload
  },
  reset: (state) => {
    const iState = initialState()
    Object.keys(iState).forEach(key => {
      state[key] = iState[key]
    })
  },
};

const actions = {
  actionFilter({commit, rootGetters}, payload) {
    let organizationType = rootGetters["App/getOrganizationType"]
    commit("filter", {...payload, organizationType});
    commit("setDefaultActive");
  },
  actionSetActive({commit}, payload) {
    commit("setActive", payload);
  },
  actionSetHeight({commit}, payload) {
    let value = (payload < 250) ? 250 : payload
    commit("setHeight", value);
  },
  actionSetWidth({commit}, payload) {
    commit("setWidth", payload);
  },
  actionReset({commit}) {
    commit("reset")
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
