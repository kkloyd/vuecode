<template>
  <div v-if="popupVisible" id="popup" class="popup">
    <div class="popup__menu">
      <el-button style="font-size: 30px; color: #fff" type="text" icon="el-icon-close" @click="close()"/>
    </div>
    <div class="popup__body">
      <div class="popup__left">
        <el-button v-if="images.length > 0" class="popup__left__button" size="medium" type="text" icon="el-icon-arrow-left" @click="prev"/>
      </div>
      <img v-if="currentImage" id="image" :src="currentImage" class="popup__image" alt="Изображение">
      <div class="popup__buttons">
        <el-button type="text" icon="el-icon-zoom-in" title="увеличить" @click="zoomIn"/>
        <el-button type="text" icon="el-icon-zoom-out" title="уменьшить" @click="zoomOut"/>
        <el-button type="text" icon="el-icon-refresh-left" title="повернуть" @click="rotate"/>
        <el-button type="text" icon="el-icon-download" title="скачать" @click="download"/>
        <el-button v-if="deletable" type="text" icon="el-icon-delete" title="удалить" @click="deleteImage"/>
      </div>
      <div class="popup__right">
        <el-button v-if="images.length > 0" class="popup__right__button" size="medium" type="text" icon="el-icon-arrow-right" @click="next()"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MediaViewer",
  props: {
    "images": {
      type: Array,
      default: () => [],
    },
    "popupVisible": {
      type: Boolean,
      default: false
    },
    "deletable": {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      photoIndex: 0,
      currentImage: null,
      currentRotation: 0,
      defaultWidth: true,
      currentScale: 1,
    }
  },
  watch: {
    popupVisible: {
      handler: function (val) {
        if(!val) {
          this.defaultWidth = true
        }
      },
      immediate: true
    },
    ["images"](val, oldVal) {
      if(oldVal) {
        this.currentImage = null
      }
      if (!this.currentImage) {
        let active = this.images.find(i => i.picked)
        this.currentImage = active.imageUrl
      }
    },
  },
  created() {
    this.currentImage = null
    document.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        this.close()
      }

      if (event.code === "ArrowRight") {
        this.next()
      }

      if (event.code === "ArrowLeft") {
        this.prev()
      }
    })
  },
  methods: {
    close() {
      this.$emit("close", false)
    },
    next() {
      this.currentImage = null
      if (this.images.length === this.photoIndex + 1) {
        this.photoIndex = 0
      } else {
        ++this.photoIndex
      }
      this.currentImage = this.images[this.photoIndex].imageUrl
    },
    prev() {
      this.currentImage = null
      if (this.photoIndex === 0) {
        this.photoIndex = this.images.length - 1
      } else {
        --this.photoIndex
      }
      this.currentImage = this.images[this.photoIndex].imageUrl
    },
    zoomIn() {
      let image = document.getElementById("image")
      this.currentScale += 0.2
      image.style.transform = `scale(${this.currentScale},${this.currentScale})`
    },
    zoomOut() {
      let image = document.getElementById("image")
      this.currentScale -= 0.2
      image.style.transform = `scale(${this.currentScale},${this.currentScale})`
    },
    rotate() {
      this.currentRotation += 90
      document.getElementById("image").style.transform = `rotate(${this.currentRotation}deg)`
    },
    download() {
      let a = document.createElement("a");
      a.href = this.currentImage;
      a.setAttribute("download", "image");
      a.click();
    },
    deleteImage() {
      this.$confirm("Действительно удалить?", "Внимание", {
        confirmButtonText: "OK",
        cancelButtonText: "Отмена",
        type: "warning"
      }).then(() => {
        this.$emit("delete", this.images[this.photoIndex])
        this.currentImage = null
      })
    }
  }
}
</script>

<style>
  .popup {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    top: 0;
    left: 0;
    z-index: 999;
    /*overflow-y: auto;*/
    /*overflow-x: hidden;*/
    overflow: hidden;
  }

  .popup__body {
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 10px;
    flex-direction: column;
  }

  .popup__menu {
    position: absolute;
    top: 20px;
    right: 30px;
  }

  .popup__menu > button {
    margin: 0 20px;
  }

  .popup__image {
    width: 60%;
    height: 60%;
    object-fit: contain;
    -o-object-fit: contain;
    transition: 0.2s;
  }

  .popup__left {
    height: 100vh;
    width: 100px;
    position: absolute;
    left: 20px;
    top: 75px;
  }

  .popup__left__button {
    top: calc(50% - 75px);
    position: absolute;
    font-size: 70px;
    color: #fff;
    z-index: 999;
  }

  .popup__right__button {
    top: calc(50% - 75px);
    position: absolute;
    font-size: 70px;
    color: #fff;
    z-index: 999;
  }

  .popup__right {
    height: 100vh;
    width: 100px;
    position: absolute;
    right: 20px;
    top: 75px;
  }

  .popup__buttons {
    position: absolute;
    height: 50px;
    right: 10%;
    bottom: 2%;
  }

  .popup__buttons > button {
    margin-left: 10px;
    margin-right: 30px;
    font-size: 30px;
    color: #fff
  }


</style>

