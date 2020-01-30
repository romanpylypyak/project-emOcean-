<template>
  <div>
    <div class="row justify-center">
      <div class="vueCropperWrapper">
        <vue-cropper
          ref="cropper"
          :aspect-ratio="aspectRatio"
          :src="src"
          :view-mode="1"
          class="cropper"
        />
      </div>
    </div>

    <div class="row justify-center q-pt-md">
      <q-btn
        flat
        round
        class="text-cyan"
        icon="zoom_in"
        @click="zoom(0.2)"
      />
      <q-btn
        flat
        round
        class="text-cyan"
        icon="zoom_out"
        @click="zoom(-0.2)"
      />
      <q-btn
        flat
        round
        class="text-cyan"
        icon="rotate_left"
        @click="rotate(-45)"
      />
      <q-btn
        flat
        round
        class="text-cyan"
        icon="rotate_right"
        @click="rotate(45)"
      />
      <q-btn
        flat
        round
        class="text-cyan"
        ref="flipX"
        icon="flip"
        @click="flipX"
      />
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  components: {
    VueCropper
  },

  props: {
    aspectRatio: {
      type: Number,
      default: 1
    },
    src: {
      type: String,
      default: ''
    }
  },

  methods: {
    flipX () {
      const dom = this.$refs.flipX.$el
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleX(scale)
      dom.setAttribute('data-scale', scale)
    },

    zoom (percent) {
      this.$refs.cropper.relativeZoom(percent)
    },

    rotate (deg) {
      this.$refs.cropper.rotate(deg)
    },

    getCroppedData () {
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        this.$emit('on-created-blob', blob)
      })
    }
  },

  watch: {
    src (newValue) {
      this.$refs.cropper.replace(newValue)
    }
  }
}
</script>

<style scoped>
.vueCropperWrapper {
  max-width: 300px;
}
</style>

<style>
.cropper img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>
