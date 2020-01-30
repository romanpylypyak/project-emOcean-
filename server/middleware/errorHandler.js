const CustomError = require('../common/CustomError')

const errorHandler = (err, req, res, next) => {
  const error = { ...err }

  error.message = err.message
  if (
    error.message ===
    'There is no user record corresponding to this identifier. The user may have been deleted.'
  ) {
    error.message = 'User with entered email not found.'
  }
  if (
    error.message ===
    'The password is invalid or the user does not have a password.'
  ) {
    error.message = 'You entered a wrong password. Please try again.'
  }
  res
    .status(err.status || 400)
    .json({ error: error.message || 'Unexpected error' })
}

module.exports = errorHandler
