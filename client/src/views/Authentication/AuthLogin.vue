<template>
  <div class="row login-container">
    <div class="gt-xs offset-sm-2 col-sm-4 offset-md-3 col-md-3 simple-container">
      <img id='logo-img' src='../../assets/emocean-logo.png' />
      <h4>For dreamers who want to stay in motion</h4>
    </div>
    <AuthLoginComponent :loginClassList="'offset-xs-1 col-xs-10 col-sm-4 col-md-3 column simple-container'"/>
  </div>
</template>

<script>
import AuthLoginComponent from './AuthLoginComponent.vue'
import { isAuthorized } from '@/services/Authorized.js'

export default {
  components: {
    AuthLoginComponent
  },
  beforeRouteEnter: (to, from, next) => {
    isAuthorized()
      .then(res => {
        return res ? next('/feed') : next()
      })
      .catch(() => {
        return next()
      })
  }
}
</script>

<style scoped>
.login-container {
  overflow: auto;
  padding: 50px 0 30px 0;
}

#logo-img {
  max-width: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

h4 {
  font-weight: 200;
  letter-spacing: 3px;
}

.simple-container {
  padding: 1rem;
  background: #e7f0f1;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
