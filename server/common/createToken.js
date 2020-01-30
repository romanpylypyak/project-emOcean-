const jwt = require('jsonwebtoken')

module.exports = createJwtToken = value => {
  return jwt.sign({ value }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
    // httpOnly: true
  })
}
