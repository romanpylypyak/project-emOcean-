<template>
  <div class="row reset-container">
    <div class="gt-xs offset-sm-2 col-sm-4 offset-md-3 col-md-3 simple-container">
      <img id='logo-img' src='../../assets/emocean-logo.png' />
    </div>
    <div class="offset-xs-1 col-xs-10 col-sm-4 col-md-3 column simple-container" v-if="reset">
      <q-input v-model.lazy="password" :type="isPwd1 ? 'password' : 'text'" label="Password" :dense="dense" :rules="[val => checkPasswordField(val)]">
        <template v-slot:append>
          <q-icon
            :name="isPwd1 ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd1 = !isPwd1"
          />
        </template>
      </q-input>

      <q-input v-model.lazy="passwordConfirm" :type="isPwd2 ? 'password' : 'text'" label="Confirm Password" :dense="dense" :rules="[val => checkRepeatPasswordField(val)]">
        <template v-slot:append>
          <q-icon
            :name="isPwd2 ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd2 = !isPwd2"
          />
        </template>
      </q-input>

      <q-btn color="white" text-color="black" @click="resetPass" :disabled="!enableCreate">Set password
        <q-spinner-bars
          class='q-ml-md'
          color="primary"
          size="1em"
          v-show="loading"
        />
      </q-btn>

      <p class="q-mt-md" >{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { validationMixin } from '../../utilities/validationMixin.js'
import { mapActions } from 'vuex'
import { resetPass } from '@/services/auth.js'
import { isAuthorized } from '@/services/Authorized.js'

export default {
  mixins: [validationMixin],
  data () {
    return {
      password: '',
      passwordConfirm: '',
      dense: false,
      isPwd1: true,
      isPwd2: true,
      loading: false,
      reset: false,
      passwordField: false,
      oobCode: '',
      message: ''
    }
  },

  methods: {
    ...mapActions({ notifyResetAction: 'auth/notifyReset' }),
    resetPass () {
      this.loading = true
      const { password, oobCode } = this
      resetPass({ password, oobCode })
        .then(res => {
          this.loading = false
          this.notifyResetAction(true)
          this.$router.push('/login')
        })
        .catch(err => {
          this.message = err.response ? err.response.data.error : 'Sorry. Something has gone wrong...'
          this.loading = false
        })
    }
  },

  computed: {
    enableCreate () {
      return !!this.passwordField && this.password === this.passwordConfirm
    }
  },

  created: function () {
    if (this.$route.query.mode === 'resetPassword') {
      this.reset = true
      this.oobCode = this.$route.query.oobCode
    } else {
      this.reset = false
    }
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
.reset-container {
  overflow: auto;
  padding: 50px 0 30px 0;
}

.simple-container {
  padding: 1rem;
  background: #e7f0f1;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

#error-message {
  color: #C10015;
}
</style>
