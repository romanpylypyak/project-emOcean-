<template>
  <q-dialog persistent v-model="showLoginPage">
    <div class="modal-login q-pa-lg">
      <h5>You need log in to continue</h5>
      <v-auth-login-component :loginClassList="'col modal-login'" />
    </div>
  </q-dialog>
</template>

<script>
import AuthLoginComponent from './AuthLoginComponent'

export default {
  props: ["showLoginPage"],
  components: {
    'v-auth-login-component': AuthLoginComponent
  }
}
</script>

<style scoped>
.modal-login {
  background-color: white;
  border-radius: 25px;
}
</style>
