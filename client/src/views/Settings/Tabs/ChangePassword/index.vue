<template>
  <q-page>
    <q-form class="q-gutter-md" @submit="onFormSubmit">
      <q-input
        label="Current password"
        placeholder="Type your current password"
        v-model="formModel.currentPassword"
        :type="isCurrentPassVisible ? 'text' : 'password'"
        :rules="[requiredField]"
      >
        <template v-slot:append>
          <q-icon
            :name="isCurrentPassVisible ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="isCurrentPassVisible = !isCurrentPassVisible"
          />
        </template>
      </q-input>
      <q-input
        label="New password"
        placeholder="Type your new password"
        v-model="formModel.newPassword"
        :type="isNewPassVisible ? 'text' : 'password'"
        :rules="[checkPasswordField, requiredField]"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon
            :name="isNewPassVisible ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="isNewPassVisible = !isNewPassVisible"
          />
        </template>
      </q-input>
      <q-input
        label="Confirm new password"
        placeholder="Confirm your new password"
        v-model="formModel.confirmNewPassword"
        :type="isConfirmNewPassVisible ? 'text' : 'password'"
        :rules="[checkConfirmPassword, requiredField]"
        lazy-rules
      >
        <template v-slot:append>
          <q-icon
            :name="isConfirmNewPassVisible ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="isConfirmNewPassVisible = !isConfirmNewPassVisible"
          />
        </template>
      </q-input>
      <div class="q-pt-md">
        <q-btn label="Change password" type="submit" rounded color="secondary" />
        <br />
        <q-btn
          label="Forgot password?"
          @click="onForgotPasswordClick"
          rounded
          color="secondary"
          flat
          class="q-mt-md"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import {
  requiredField,
  checkPasswordField,
  checkRepeatPasswordField
} from '@/utilities/validation.js'
import { changePassword } from '@/services/auth.js'

export default {
  data () {
    return {
      isCurrentPassVisible: false,
      isNewPassVisible: false,
      isConfirmNewPassVisible: false,
      formModel: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }
  },

  methods: {
    requiredField,
    checkPasswordField,
    checkConfirmPassword (newval) {
      return checkRepeatPasswordField(newval, this.formModel.newPassword)
    },
    onForgotPasswordClick () {
      this.$router.push({ path: '/forgotpassword' })
    },
    onFormSubmit () {
      const notifyParameters = {
        textColor: 'white',
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 3000
      }
      changePassword({
        oldPassword: this.formModel.currentPassword,
        newPassword: this.formModel.newPassword
      })
        .then((response) => {
          this.$q.notify({
            ...notifyParameters,
            color: 'primary',
            message: 'Your password was changed.'
          })
        })
        .catch(err => {
          this.$q.notify({
            ...notifyParameters,
            color: 'negative',
            message: err && err.response && err.response.data ? err.response.data.error : 'Unknown error.'
          })
        })
    }
  }
}
</script>

<style scoped>
.q-field--with-bottom {
  padding-bottom: 10px;
}
</style>
