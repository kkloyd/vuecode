import Auth from "@/services/Auth"

export default {
  data() {
    return {
      pageViewRecordsTimer: null,
      pageViewRecordsInited: false,
    }
  },
  watch: {
    appReady: {
      handler: function (val, oldVal) {
        if (!this.pageViewRecordsInited && oldVal === false && val === true) {
          this.pageViewRecordsInited = true
          if (Auth.isUser() === true) {
            this.$store.dispatch("PageViewRecords/actionFlush")
            this.setEvent()
            this.startTimer()
          }
        }
      },
    },
  },
  methods: {
    setEvent() {
      window.addEventListener("beforeunload", () => {
        this.$store.dispatch("PageViewRecords/actionSetRecordDuration")
      })
    },
    startTimer() {
      if (this.pageViewRecordsTimer) {
        clearTimeout(this.pageViewRecordsTimer)
      }
      this.pageViewRecordsTimer = setTimeout(() => {
        this.sendStatistics()
      }, 1 * 60 * 1000)
    },
    sendStatistics() {
      this.$store.dispatch("PageViewRecords/actionSendStatistics")
      this.startTimer()
    },
  },
}
