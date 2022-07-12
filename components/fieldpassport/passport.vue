<template>
  <div v-loading="loading">
    <div class="cards">
      <el-card :body-style="{padding: '20px 15px 15px 15px'}" class="cards__item" style="max-width: calc(100% / 3 - 20px)">
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Номер поля:
          </div>
          <div class="cards__item__row__value">
            {{ passport.name }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Площадь поля (kml):
          </div>
          <div v-show="Object.prototype.hasOwnProperty.call(passport, 'area')" class="cards__item__row__value">
            {{ passport.area }} ({{ passport.polygonArea }})
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Посевная площадь
          </div>
          <div v-if="passport.seedLimitArea" class="cards__item__row__value">
            {{ passport.seedLimitArea }}
          </div>
          <div v-if="!passport.seedLimitArea" class="cards__item__row__value">
            -
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Площадь лиманов и неудобий:
          </div>
          <div v-if="passport.limansArea" class="cards__item__row__value">
            {{ passport.limansArea }}
          </div>
          <div v-if="!passport.limansArea" class="cards__item__row__value">
            -
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Культура:
          </div>
          <div class="cards__item__row__value">
            {{ passport.culture }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Сорт:
          </div>
          <div class="cards__item__row__value">
            {{ passport.sorts }}
          </div>
        </div>
      </el-card>
      <el-card :body-style="{padding: '20px 15px 15px 15px'}" class="cards__item" style="max-width: calc(100% / 3 - 20px)">
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Репродукция:
          </div>
          <div class="cards__item__row__value">
            {{ passport.reproductions }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Балл бонитета:
          </div>
          <div class="cards__item__row__value">
            {{ passport.bonitetScore }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Балл продуктивности:
          </div>
          <div class="cards__item__row__value">
            {{ passport.fieldScore }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Предшественник:
          </div>
          <div class="cards__item__row__value">
            {{ passport.prevCulture }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Дата посева:
          </div>
          <div class="cards__item__row__value">
            {{ passport.sowingRange }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Дата уборки:
          </div>
          <div class="cards__item__row__value">
            {{ passport.harvestingRange }}
          </div>
        </div>
      </el-card>
      <el-card :body-style="{padding: '20px 15px 15px 15px'}" class="cards__item" style="max-width: calc(100% / 3 - 20px)">
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Зона:
          </div>
          <div class="cards__item__row__value">
            {{ passport.zone }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Рельеф местности:
          </div>
          <div class="cards__item__row__value">
            {{ passport.terrain }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Гранулометрический состав:
          </div>
          <div class="cards__item__row__value">
            {{ passport.composition }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Тип почвы:
          </div>
          <div class="cards__item__row__value">
            {{ passport.soilType }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Контур поля:
          </div>
          <div class="cards__item__row__value">
            {{ passport.fieldContour }}
          </div>
        </div>
        <div class="cards__item__row">
          <div class="cards__item__row__label">
            Бригада:
          </div>
          <div class="cards__item__row__value">
            {{ passport.brigade }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import http from "@/services/http"

export default {
  name: "Passport",
  props: {
    "fieldId": {
      type: Number,
      default: null,
    },
    "orientation": {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passport: {},
      loading: false,
    }
  },
  watch: {
    fieldId: {
      handler: function (val) {
        if (val) this.getPassport(val)
        else this.passport = {}
      },
      immediate: true,
    },
  },
  methods: {
    getPassport(fieldId) {
      this.loading = true
      this.passport = {}
      let params = `?id=${fieldId}&year=${this.$store.getters["Contexts/getYear"]}`
      if (this.$store.getters["App/getModule"] == "agroplan") {
        params += `&budgetId=${this.$store.getters["Contexts/getBudget"]}`
      }
      http.getCache(`fields/getcard${params}`)
        .then(data => {
          if (this.fieldId == fieldId) {
            this.passport = data
          }
        })
        .catch(e => {
          throw e;
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
}
</script>
