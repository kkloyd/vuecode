import {deepClone, findBy} from "@/lib/utils";

import Queue from "./queue";

function initialState() {
  return {
    alertmethods: [],
    alertrules: [],
    alerts: [],
    alerttype: [],
    agrofontypes: [],
    analysiscardtypes: [],
    apimethods: {},
    areaassignments: [],
    assignmentsdailyreportitems: [],
    assignmenttypes: [],
    barrierdeviationreportitemtypes: [],
    brigades: [],
    businessprocesses: [],
    caravailabilities: [],
    carfuelsettingothersensortypes: [],
    cargpsidentifier: [],
    carmarks: [],
    carmodelfuelnorms: [],
    carmodelgroups: [],
    carmodels: [],
    cars: [],
    carschild: [],
    carsall: [],
    carsensors: [],
    carstatusextended: {},
    carstopstatuses: [],
    cartypes: [],
    chemicalpreparationprices: [],
    chemicalpreparations: [],
    chemicalpreparationtypes: [],
    chemistrylimitfact: [],
    chemistrylimits: [],
    clearingactreportitems: [],
    compositions: [],
    conditiontypes: [],
    contractors: [],
    cropbalanceusers: [],
    cropdecommission: [],
    croprotations: [],
    croprotationsproduction: [],
    croprotationsall: [],
    culturedepths: [],
    culturefieldzones: [],
    cultureparameters: [],
    culturequalityconditions: [],
    culturequalitytypes: [],
    culturerotation: [],
    cultures: [],
    culturetypes: [],
    customorganizations: [],
    destinationwarehouses: [],
    destructionacts: [],
    developers: [],
    diseases: [],
    diseaselevels: [],
    dozhimreservations: [],
    downtimereasons: [],
    echelons: [],
    echelonTypes: [],
    echelonHarvestings: [],
    employees: [],
    employeesall: [],
    employeestatus: [],
    equipments: [],
    eventtype: [],
    faqcategories: [],
    faqpages: [],
    fertilizerlimits: [],
    fieldcondition: [],
    fieldcontours: [],
    fieldlastassignments: [],
    fieldlastassignmentsall: [],
    fieldsall: [],
    fieldtypes: [],
    fieldweediness: [],
    fieldzones: [],
    fieldscores: [],
    fieldscoresall: [],
    fieldsurveys: [],
    finalproducts: [],
    finalproducttranslations: [],
    finalproducttypes: [],
    fuelnorms: [],
    fueldeviationsrequeststatus: [],
    fueltypes: [],
    globaladmin: [],
    gpsproviders: [],
    grainindicator: [],
    grainoutsideofwarehouse: [],
    grainprocessings: [],
    grainprocessingtypes: [],
    grainwastes: [],
    growthdefinitions: [],
    helpstructureitems: [],
    incomingtransfers: [],
    insects: [],
    instruments: [],
    instrumenttypes: [],
    internaltransfers: [],
    inventoriesreporttypes: [],
    inventory: [],
    kadastrfield: [],
    kadastrfieldgroup: [],
    kml: [],
    kmlchild: [],
    kmlall: [],
    kmlcontractor: [],
    kmlwarehouse: [],
    kmlwarehousebygroup: [],
    kmlwarehousechild: [],
    leaflettracks: [],
    legend: [],
    modules: [],
    notetype: [],
    nutrientsaddition: [],
    observationact: [],
    operativeinformationtype: [],
    orderforshipment: [],
    organizationequipments: [],
    organizationgroupcarmodels: [],
    organizationgroupinstruments: [],
    organizationgroupmodules: [],
    organizationinstruments: [],
    organizations: [],
    organizationsgroup: [],
    organizationsshortname: [],
    organizationtype: [],
    outgoingtransfers: [],
    ownershiptype: [],
    pages: [],
    pageviewrecords: [],
    paymentsadditionals: [],
    permissiongroups: [],
    permissionsbyuserrole: [],
    previoussowings: [],
    processedstatuses: [],
    productreservations: [],
    qualitytypes: [],
    qualitytypevaluecodes: [],
    realizations: [],
    reproductions: [],
    reservationtypes: [],
    ripenessgroups: [],
    seedlimitcoordinates: [],
    seedlimitcoordinateschild: [],
    seedlimits: [],
    seedlimitschild: [],
    seedmordant: [],
    seedprices: [],
    sensorsettings: [],
    sensortypes: [],
    smells: [],
    soiltypes: [],
    soilstructures: [],
    sorts: [],
    sowings: [],
    sowingsall: [],
    sowingstopcultures: [],
    stopjournals: [],
    stoptypes: [],
    storages: [],
    storagetypes: [],
    suboperations: [],
    transfertypes: [],
    tankcarsensorsetting: [],
    tanksensorsettingvaluetypes: [],
    technologyreciept: [],
    technologyreciepttypes: [],
    terrains: [],
    thirdpartyelevatorgrains: [],
    threatlevel: [],
    transfertoelevators: [],
    transportationroutecategories: [],
    transportationpointtypes: [],
    transportationrate: [],
    transportationjobtypes: [],
    transportationroutes: [],
    unittypes: [],
    userpermissions: [],
    userrole: [],
    users: [],
    volumetypes: [],
    warehouses: [],
    warehouseschild: [],
    warehousetypes: [],
    weed: [],
    weedgrowingphases: [],
    weedtypes: [],
    workconditions: [],
    workdates: [],
    works: [],
    worktypeparameterplanworktypes: [],
    worktypeparameters: [],
    yearconstants: [],
    inventoryanalysiscards: [],
    orderForShipmentAnalysisCards: [],
    ndviaverage: [],
    agrooperations: [],
    providercarrfidtable: []
  }
}

const state = {
  ...initialState(),
  budgets: [],
  fields: [],
  userorganizations: [],
  responseStatus: {},
};

const getters = {
  getEntity: (state) => (entity) => {
    entity = entity.toLowerCase();
    let result = deepClone(state[entity])
    return result
  },
  getEntityById: (state) => (id, entity, attr) => {
    let _attr = attr || "id"
    entity = entity.toLowerCase();
    let result = deepClone(findBy(state[entity], _attr, id))
    return result
  },
  getEntityByParameter: (state) => (param = {name: null, value: null, entity: null}) => {
    param.entity = param.entity.toLowerCase();
    return findBy(state[param.entity], param.name, param.value)
  },
  getResponseStatus: (state) => (entity) => {
    entity = entity.toLowerCase();
    let result = deepClone(state.responseStatus[entity])
    return result
  },
};

const mutations = {
  addEntity: (state, payload) => {
    payload.state = payload.state.toLowerCase();
    state[payload.state] = payload.data;
  },
  resetEntity: (state, payload) => {
    const iState = initialState()
    payload.state = payload.state.toLowerCase();
    state[payload.state] = iState[payload.state];
  },
  clearEntities: (state, entities) => {
    const iState = initialState()
    const iStateKeys = Object.keys(iState)
    const keys = entities.length ? entities.filter(key => iStateKeys.includes(key)) : iStateKeys
    keys.forEach(key => {
      state[key] = iState[key]
      delete state.responseStatus[key]
    })
  },
  setResponseStatus: (state, payload) => {
    payload.state = payload.state.toLowerCase();
    state.responseStatus[payload.state] = payload.status;
  },
};

const actions = {
  actionAddEntity: ({commit}, payload) => {
    commit("addEntity", {state: payload.name, data: payload.data});
  },
  actionResetEntity: ({commit}, payload) => {
    commit("resetEntity", {state: payload.name});
  },
  actionClearEntities: ({commit}, payload = []) => {
    commit("clearEntities", payload);
  },
  actionSetResponseStatus: ({commit}, payload) => {
    commit("setResponseStatus", {state: payload.name, status: payload.status});
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    Queue,
  },
}
