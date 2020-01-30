<template>
  <div class="row register-container">
    <div class="gt-xs offset-sm-2 col-sm-4 offset-md-3 col-md-3 simple-container">
      <img id="logo-img" src="../../assets/emocean-logo.png" />
      <h4>For dreamers who want to stay in motion</h4>
    </div>
    <div class="offset-xs-1 col-xs-10 col-sm-4 col-md-3 column simple-container">
      <q-input
        v-model.lazy="email"
        label="Email"
        :dense="dense"
        :rules="[val => checkEmailField(val)]"
      />

      <q-input
        v-model.lazy="nickname"
        label="Nickname"
        :dense="dense"
        :rules="[val => checkNicknameField(val)]"
      />

      <q-input
        v-model.lazy="password"
        :type="isPwd1 ? 'password' : 'text'"
        label="Password"
        :dense="dense"
        :rules="[val => checkPasswordField(val)]"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd1 ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd1 = !isPwd1"
          />
        </template>
      </q-input>

      <q-input
        v-model.lazy="passwordConfirm"
        :type="isPwd2 ? 'password' : 'text'"
        label="Repeat Password"
        :dense="dense"
        :rules="[val => checkRepeatPasswordField(val)]"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd2 ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd2 = !isPwd2"
          />
        </template>
      </q-input>

      <p id="error-message">{{ error }}</p>

      <q-btn
        color="white"
        text-color="black"
        id="create-button"
        @click="register"
        :disabled="!enableCreate"
      >
        create account
        <q-spinner-bars class="q-ml-md" color="primary" size="1em" v-show="loading" />
      </q-btn>

      <p class="paragraph">
        Already have an account?
        <router-link to="/login">Log In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { validationMixin } from '../../utilities/validationMixin.js'
import { mapActions } from 'vuex'
import { register } from '@/services/auth.js'
import { isAuthorized } from '@/services/Authorized.js'

export default {
  mixins: [validationMixin],
  data () {
    return {
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      dense: false,
      isPwd1: true,
      isPwd2: true,
      loading: false,
      emailField: false,
      nicknameField: false,
      passwordField: false,
      error: ''
    }
  },

  methods: {
    ...mapActions({ signIn: 'auth/signin', notifyRegister: 'auth/notifyRegistered' }),
    register () {
      this.loading = true
      const { email, password, nickname } = this
      register({ email, password, nickname })
        .then(res => {
          this.loading = false
          this.notifyRegister(true)
        })
        .then(res => {
          this.$router.push('/login')
        })
        .catch(err => {
          this.error = err.response ? err.response.data.error : 'Sorry. Something has gone wrong...'
          this.loading = false
        })
    }
  },
  computed: {
    enableCreate () {
      return !!this.emailField && !!this.nicknameField && !!this.passwordField && this.password === this.passwordConfirm
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
.register-container {
  overflow: auto;
  padding: 50px 0 30px 0;
}

.simple-container {
  padding: 1rem;
  background: #e7f0f1;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

#error-message {
  color: #c10015;
}

#google-img {
  height: 1.5rem;
}

#center-paragraph {
  text-align: center;
  margin-top: 20px;
}

.paragraph {
  margin-top: 20px;
  margin-bottom: 0;
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

a {
  text-decoration: none;
}
</style>
