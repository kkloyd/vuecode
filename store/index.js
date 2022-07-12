import Vue from "vue";
import Vuex from "vuex";

import App from "./modules/app";
import Auth from "./modules/auth";
import Catalog from "./modules/catalog";
import Columns from "./modules/columns";
import Contexts from "./modules/contexts";
import Echelons from "./modules/echelons"
import EntityLoader from "./modules/entity-loader";
import Forms from "./modules/forms";
import HeaderSearch from "./modules/header-search";
import Help from "./modules/help";
import JSSSheetsManager from "./modules/jss-sheets-manager";
import Linker from "./modules/linker";
import Map from "./modules/map";
import Realization from "./modules/realization";
import Router from "./modules/router";
import Sidebar from "./modules/sidebar";
import Sowings from "./modules/sowings";
import TablePagination from "./modules/table-pagination";
import WidthToggle from "./modules/width-toggle";
import WindowResize from "./modules/window-resize";
import PageViewRecords from "./modules/page-view-records";
import Theme from "./modules/theme";
import Admin from "./modules/admin"
import Filter from "./modules/filter"

Vue.use(Vuex);

export const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    App,
    Auth,
    Catalog,
    Columns,
    Contexts,
    Echelons,
    EntityLoader,
    Forms,
    Filter,
    HeaderSearch,
    Help,
    JSSSheetsManager,
    Linker,
    Map,
    Realization,
    Router,
    Sidebar,
    Sowings,
    TablePagination,
    WidthToggle,
    WindowResize,
    PageViewRecords,
    Theme,
    Admin,
  }
});
