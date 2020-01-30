import validator from 'validator'

export function requiredField (val) {
  if (validator.isEmpty(val)) {
    return 'This field cannot be empty'
  }
}

export function checkNicknameField (val) {
  if (!validator.isLength(val, { min: 4, max: 20 })) {
    return 'Your nickname should be 4 to 20 characters long'
  }
  if (/\s/.test(val)) {
    return 'Your nickname cannot contain whitespaces'
  }
}

export function checkPasswordField (val) {
  if (!validator.isLength(val, { min: 8, max: 20 })) {
    return 'Your password should contain 8 to 20 characters'
  }
  if (/\s/.test(val) || validator.isUppercase(val) || validator.isLowercase(val)) {
    return 'At least one uppercase, one lowercase character required, no whitespace allowed'
  }
}

export function checkRepeatPasswordField (newval, oldval) {
  if (newval !== oldval) {
    return 'Your passwords do not match'
  }
}

export function checkUserDescriptionField (val) {
  if (val && !validator.isLength(val, { min: 0, max: 100 })) {
    return 'Your can use maximum 100 characters'
  }
}

export function checkURL (val) {
  if (val && !validator.isURL(val) && val !== '') {
    return 'You entered incorrect link'
  }
}
