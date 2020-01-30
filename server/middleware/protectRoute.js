const jwt = require('jsonwebtoken')
const CustomError = require('../common/CustomError')

const protected = (req, res, next) => {
  let token
  // check what is in req.header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from header
    token = req.headers.authorization.split(' ')[1]
  }
  // Make sure token exists
  if (!token) {
    return next(
      new CustomError({
        name: 'AuthozationError',
        message: "You don't have token to be able to pass this route",
        status: 401
      })
    )
  }
  // Verify
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET).value

    req.userId = decoded.uid

    next()
  } catch (err) {
    return next(
      new CustomError({
        name: 'AuthozationError',
        message: 'Incorrect token',
        status: 401
      })
    )
  }
}

module.exports = protected
