const validator = require('validator')

export const validationMixin = {
  methods: {
    // validation
    checkEmailField (val) {
      if (validator.isEmpty(val)) {
        this.emailField = false
        return 'Email field cannot be empty'
      }
      if (!validator.isEmail(val)) {
        this.emailField = false
        return 'Your email is invalid'
      } else {
        this.emailField = true
      }
    },
    checkNicknameField (val) {
      if (validator.isEmpty(val)) {
        this.nicknameField = false
        return 'Nickname field cannot be empty'
      }
      if (!validator.isLength(val, { min: 4, max: 20 })) {
        this.nicknameField = false
        return 'Your nickname should be 4 to 20 characters long'
      }
      if (/\s/.test(val)) {
        this.nicknameField = false
        return 'Your nickname cannot contain whitespaces'
      } else {
        this.nicknameField = true
      }
    },
    checkPasswordField (val) {
      if (validator.isEmpty(val)) {
        this.passwordField = false
        return 'Password field cannot be empty'
      }
      if (!validator.isLength(val, { min: 8, max: 20 })) {
        this.passwordField = false
        return 'Your password should contain 8 to 20 characters'
      }
      if (/\s/.test(val) || validator.isUppercase(val) || validator.isLowercase(val)) {
        this.passwordField = false
        return 'At least one uppercase, one lowercase character required, no whitespace allowed'
      } else {
        this.passwordField = true
      }
    },
    checkRepeatPasswordField (val) {
      if (this.password !== this.passwordConfirm) {
        return 'Your passwords do not match'
      }
    },
    // notifications
    showNotif (message) {
      this.$q.notify({
        color: 'primary',
        textColor: 'white',
        message: message,
        actions: [{ icon: 'close', color: 'white' }],
        timeout: 3000
      })
    }
  }
}
