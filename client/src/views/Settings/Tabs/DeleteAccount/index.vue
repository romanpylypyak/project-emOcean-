<template>
  <div>
    <p class="danger text-h5">ATTENTION!!!</p>
    <p>This action will delete your account</p>
    <q-btn label="DELETE" color="pink" @click="confirm = true" />
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="pink" text-color="white" />
          <span class="q-ml-sm">Do you really want to delete your account?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="teal" v-close-popup />
          <q-btn flat label="Delete" color="pink" @click="deleteProfile()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { deleteAccount } from '@/services/auth.js'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'DeleteAccount',
  data () {
    return {
      confirm: false
    }
  },
  methods: {
    ...mapActions('auth', ['logOut']),
    deleteProfile () {
      let user = this.getProfile
      deleteAccount(user)
        .then((res) => {
          this.userLogOut()
        })
        .catch(error => {
          if (error.response) {
            this.$q.notify({
              textColor: 'white',
              actions: [{ icon: 'announcement', color: 'white' }],
              message: 'Failed to delete profile!'
            })
          }
        })
    },
    userLogOut () {
      this.$store.dispatch('profile/clear')
      this.$store.dispatch('comments/clear')
      this.$store.dispatch('clear')
      this.$store.dispatch('auth/signin', { token: '', user: '' })
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('profileId')
      delete axios.defaults.headers.common['Authorization']
      this.$q.notify({
        textColor: 'white',
        actions: [{ icon: 'delete_forever', color: 'white' }],
        timeout: 3000,
        message: 'Your account was successfully deleted'
      })
      this.$router.push('/login')
    }
  },
  computed: {
    ...mapGetters({
      getProfile: 'profile/myProfileId',
      getToken: 'auth/getToken'
    })
  }
}

</script>

<style scoped>
.danger {
  color: #e91e63;
}
</style>
