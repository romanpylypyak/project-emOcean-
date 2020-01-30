const validator = require('validator')

const validateEmail = email => {
  if (validator.isEmpty(email)) {
    return {
      name: 'ValidationError',
      message: 'Email field is empty. Please add email',
      status: 400
    }
  }
  if (!validator.isEmail(email)) {
    return {
      name: 'ValidationError',
      message: 'Email is invalid. Please type correct email',
      status: 400
    }
  }
}
const validatePassword = password => {
  if (validator.isEmpty(password)) {
    return {
      name: 'ValidationError',
      message: 'Password field is empty. Please add password',
      status: 400
    }
  }
  if (
    !validator.isLength(password, { min: 8, max: 20 }) ||
    validator.isEmpty(password) ||
    /\s/.test(password) ||
    validator.isUppercase(password) ||
    validator.isLowercase(password)
  ) {
    return {
      name: 'ValidationError',
      message:
        'Password field requires a length of 8 with maximum 20 characters. It must have at least one character with uppercase  and one with lowercase and dont have white spaces',
      status: 400
    }
  }
}

const validateNickname = nickname => {
  if (validator.isEmpty(nickname)) {
    return {
      name: 'ValidationError',
      message: 'Nickname field is empty. Please add nickname',
      status: 400
    }
  }
  if (
    !validator.isLength(nickname, { min: 4, max: 20 }) ||
    /\s/.test(nickname)
  ) {
    return {
      name: 'ValidationError',
      message:
        'Nickname field requires a length of 4 with maximum 20 characters and it cant have any whitespaces',
      status: 400
    }
  }
}

module.exports = {
  validateEmail,
  validateNickname,
  validatePassword
}
