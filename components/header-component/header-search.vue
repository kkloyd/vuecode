<template>
  <div class="search">
    <transition name="slide-search" mode="in-out">
      <template v-if="!isSearchHidden">
        <el-select
          ref="headerSearch"
          v-model="query"
          :remote-method="querySearch"
          no-match-text="Не найдено"
          no-data-text="Не найдено"
          value-key="id"
          size="small"
          class="header-search"
          placeholder="Поиск по сайту"
          filterable
          default-first-option
          remote
          @blur="onFocusOut"
          @change="handleChange"
        >
          <el-option-group
            v-for="group in suggestions"
            :key="group.key"
            :label="group.label"
          >
            <el-option
              v-for="suggestion in group.suggestions"
              :key="suggestion.key"
              :value="suggestion"
            >
              <div class="suggestion">
                <div v-if="suggestion.module" class="suggestion-section">
                  {{ suggestion.section }}
                </div>
                <div v-if="suggestion.menu" class="suggestion-menu">
                  {{ suggestion.menu }}
                </div>
                <div v-if="suggestion.item" class="suggestion-item">
                  {{ suggestion.item }}
                </div>
              </div>
            </el-option>
          </el-option-group>
        </el-select>
      </template>
    </transition>
    <transition name="switch" mode="out-in" appear>
      <el-button v-if="isSearchHidden" key="open" icon="el-icon-search" type="text"
                 class="search-btn" title="Поиск"
                 size="medium" @click="showSearch()"
      />
      <el-button v-else key="close" icon="el-icon-close" type="text"
                 class="close-btn" title="Скрыть"
                 size="medium" @click="hideSearch()"
      />
    </transition>
  </div>
</template>

<script>
const lunr = require("lunr")
require("lunr-languages/lunr.stemmer.support")(lunr)
require("lunr-languages/lunr.multi")(lunr)
require("lunr-languages/lunr.ru")(lunr)
import catalog from "@/pages/catalog/navigation"
import Auth from "@/services/Auth"
import {modules} from "@/modules.js"
import {deepClone} from "@/lib/utils"

export default {
  name: "HeaderSearch",
  data() {
    return {
      isSearchHidden: true,
      query: "",
      links: [],
      linksMap: {},
      idx: [],
      suggestions: [],
      loading: true,
      blurCounter: 0,
      groupKey: 0,
      suggestionKey: 0,
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.$store.dispatch("HeaderSearch/actionSetSearchState", false)
  },
  methods: {
    init() {
      let links = []
      links = links.concat(this.getReports(), this.getCatalog())
      if (Auth.hasRole("GlobalAdmin")) {
        links = links.concat(this.getLinks("global-admin"))
      }
      Auth.getModules()
        .filter(item => Object.keys(modules).includes(item))
        .forEach(item => {
          links = links.concat(this.getLinks(item))
        })
      links.forEach((link, index) => {
        link.id = index + 1
        link.routeSplitted = link.route.split("/").join(" ").trim()
        this.linksMap[link.id] = index
      })
      this.links = links
      let idx = lunr(function () {
        this.use(lunr.multiLanguage("en", "ru"))
        this.ref("id")
        this.field("module")
        this.field("section")
        this.field("menu")
        this.field("item")
        this.field("routeSplitted")

        links.forEach(link => (this.add(link)))
      })
      this.idx = idx
      this.loading = false
    },
    getReports() {
      let links = [], menu = []
      let organizationType = this.$store.getters["App/getOrganizationType"]
      if (organizationType === 0) {
        menu = deepClone(require(`@/routes/farm/agrofact/reports/menu.json`))
        menu.forEach(item => {
          let link = {
            "module": "Агрофакт",
            "section": "Отчеты",
            "menu": item.menu,
            "item": item.title,
            "route": `/agrofact/reports/${item.path}`
          }
          links.push(link)
        })
        menu = deepClone(require(`@/routes/farm/agroplan/reports/menu.json`))
        menu.forEach(item => {
          let link = {
            "module": "Агроплан",
            "section": "Отчеты",
            "menu": item.menu,
            "item": item.title,
            "route": `/agroplan/reports/${item.path}`
          }
          links.push(link)
        })
      } else if (organizationType === 2) {
        menu = deepClone(require(`@/routes/group/agrofact/reports/menu.json`))
        menu.forEach(item => {
          let link = {
            "module": "Агрофакт",
            "section": "Отчеты",
            "menu": item.menu,
            "item": item.title,
            "route": `/agrofact/reports/${item.path}`
          }
          links.push(link)
        })
        menu = deepClone(require(`@/routes/group/agroplan/reports/menu.json`))
        menu.forEach(item => {
          let link = {
            "module": "Агроплан",
            "section": "Отчеты",
            "menu": item.menu,
            "item": item.title,
            "route": `/agroplan/reports/${item.path}`
          }
          links.push(link)
        })
      } else if (organizationType === 3) {
        menu = deepClone(require(`@/routes/farm/agrofact/reports/menu.json`))
        menu.forEach(item => {
          let link = {
            "module": "Агрофакт",
            "section": "Отчеты",
            "menu": item.menu,
            "item": item.title,
            "route": `/agrofact/reports/${item.path}`
          }
          links.push(link)
        })
        menu = deepClone(require(`@/routes/farm/agroplan/reports/menu.json`))
        menu.forEach(item => {
          let link = {
            "module": "Агроплан",
            "section": "Отчеты",
            "menu": item.menu,
            "item": item.title,
            "route": `/agroplan/reports/${item.path}`
          }
          links.push(link)
        })
      }
      return links
    },
    getCatalog() {
      let links = []
      catalog.forEach(cItem => {
        cItem.items.forEach(item => {
          let link = {
            "section": "Справочники",
            "menu": cItem.label,
            "item": item.label,
            "route": item.link
          }
          links.push(link)
        })
      })
      return links
    },
    getLinks(name) {
      let linksJson = []
      try {
        linksJson = deepClone(require(`./links/${name}.json`))
      } catch (e) {
        linksJson = []
      }
      return linksJson
    },
    showSearch() {
      if (this.loading) return;
      this.isSearchHidden = false
      this.$store.dispatch("HeaderSearch/actionSetSearchState", true)
      this.$nextTick(() => {
        this.$refs.headerSearch.focus()
      })
    },
    onFocusOut() {
      this.blurCounter++
      if (!this.suggestions || !this.suggestions.length || this.blurCounter > 1) {
        this.hideSearch()
      } else {
        this.$refs.headerSearch.focus()
      }
    },
    hideSearch() {
      this.blurCounter = 0
      this.isSearchHidden = true
      this.$store.dispatch("HeaderSearch/actionSetSearchState", false)
      this.suggestions = []
      this.query = ""
    },
    querySearch(query) {
      if (query) {
        let suggestions = this.getSuggestionsFinal(this.modifyQuery(query))
        this.suggestions = this.groupBy(suggestions)
      } else {
        this.suggestions = []
      }
    },
    getSuggestionsFinal(query) {
      let [suggestions, results] = this.searchBy(query)
      let resultsFinal = [], suggestionsFinal = []
      resultsFinal
        .concat(results)
        .sort((a, b) => {
          return b.score - a.score
        })
        .map(item => item.ref)
        .filter((val, i, arr) => arr.indexOf(val) === i)
        .slice(0, 20)
        .forEach(id => {
          let suggestion = suggestions.find(item => item.id == id)
          suggestionsFinal.push(suggestion)
        })
      return suggestionsFinal
    },
    modifyQuery(query) {
      let fuzzy0 = [], fuzzy1 = []
      query.split(" ")
        .filter(item => item)
        .map(word => {
          let matchOperatorsRe = /[^a-z09\u0400-\u04FF]/gi
          return word.slice(0, 20).replace(matchOperatorsRe, "\\$&")
        })
        .filter(word => word.trim())
        .forEach(word => {
          (word.length >= 2) ? fuzzy1.push(word) : fuzzy0.push(word)
        })
      return [].concat(
        fuzzy0.length ? lunr.TokenSet.fromFuzzyString(fuzzy0.join(" "), 0).toArray() : [],
        fuzzy1.length ? lunr.TokenSet.fromFuzzyString(fuzzy1.join(" "), 1).toArray() : [],
      ).join(" ")
    },
    searchBy(query) {
      let results = this.idx.search(query).slice(0, 20)
      let suggestions = results.map(match => {
        return this.links[this.linksMap[match.ref]]
      })
      return [suggestions, results]
    },
    groupBy(suggestions) {
      return suggestions
        .map(s => s.module ? s.module : s.section)
        .filter((val, i, arr) => arr.indexOf(val) === i)
        .map(group => {
          return {
            key: ++this.groupKey,
            label: group,
            suggestions: suggestions
              .filter(s => {
                return s.module ? group === s.module : group === s.section
              }).map(s => {
                s.key = ++this.suggestionKey
                return s
              }),
          }
        })
    },
    handleChange(item) {
      this.hideSearch()
      let path = item.route
      if (item.section == "Справочники") {
        let rootModule
        if (["admin", "agrofact", "agroplan", "grainbalance"].includes(this.$store.getters["App/getModule"])) {
          rootModule = this.$store.getters["App/getModule"]
        } else {
          rootModule = "agrofact"
        }
        path = `/${rootModule}/${item.route}`
      }
      if (this.$route.fullPath != path) {
        this.$router.push(path)
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.search
  display flex
  align-items center
  z-index 402
  background #324057
  padding-right 5px
  .header-search
    width 500px
    >>> .el-input > *
      color #bfcbd9
  .search-btn, .close-btn
    color white
    padding 0

.slide-search-enter-active {
  transition: all .3s ease-out;
}
.slide-search-leave-active {
  transition: all .3s ease-in;
  position: absolute;
  right: -5000px;
}
.slide-search-enter, .slide-search-leave-to
/* .slide-search-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
  width: 0 !important;
}

.suggestion
  display inline-block
  > :not(:last-child)
    &:after
      content "\003e"
      font-size 10px
      display inline-block
      margin-right 3px
  &-module
    display inline-block
  &-section
    display inline-block
  &-menu
    display inline-block
  &-item
    display inline-block
</style>
