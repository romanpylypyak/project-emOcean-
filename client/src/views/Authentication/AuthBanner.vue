<template>
  <q-banner v-if="showBanner" inline-actions dark class="text-white auth-banner fixed-bottom">
    <div class="row items-center q-ml-md">
      <q-icon name="sentiment_satisfied" size="40px" class="q-mr-sm" />
      <p class="banner-text">
        Sign in to watch videos from friends and find other accounts you may
        like.
      </p>
    </div>
    <template v-slot:action>
      <div class="column q-mr-lg">
        <q-btn flat color="white" label="Sign in" to="/login" @click="closeBanner" size="20px" />
        <q-btn flat color="white" label="Register" to="/register" @click="closeBanner" size="20px" />
      </div>
    </template>
    <q-btn flat round icon="close" class="absolute-top-right" size="10px" @click="closeBanner" />
  </q-banner>
</template>

<script>
import { isAuthorized } from '@/services/Authorized.js'

export default {
  data () {
    return {
      showBanner: true
    }
  },
  methods: {
    closeBanner () {
      this.showBanner = false
    }
  },
  async created () {
    try {
      const auth = await isAuthorized()
      this.showBanner = !auth
    } catch (e) {
      this.showBanner = true
    }
  }
}
</script>
<style lang="scss" scoped>
.auth-banner {
  opacity: 0.8;
  .banner-text {
    margin: 0;
    font-size: 20px;
  }
}
@media screen and (max-width: 767px) {
  .auth-banner {
    display: none;
  }
}
</style>
