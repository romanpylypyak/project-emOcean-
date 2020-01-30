const jwt = require('jsonwebtoken')
const CustomError = require('../common/CustomError')
const profilesService = require('../services/ProfilesService')

const blocked = (req, res, next) => {
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
  if (!token || token === 'null') {
    return next()
  }
  // Verify
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET).value
    req.userId = decoded.uid

    //for profile-action/get-followers/get-followings routes
    if (req.params.id || req.query.id) {
      (async function () {
        const soughtId = req.params.id ? req.params.id : req.query.id
        const profile = await profilesService.getProfileById(soughtId)
        if (profile.blockedProfiles.includes(req.userId)) {
          return next(
            new CustomError({
              name: 'BlockError',
              message: 'You have been blocked by this user',
              status: 403
            })
          )
        } else {
          return next()
        }
      }())
    }

    // for get-profile route
    if (req.query.nickname) {
      (async function () {
        const soughtNickname = req.query.nickname
        const profile = await profilesService.getProfileByNickname(soughtNickname)
        if (profile.blockedProfiles.includes(req.userId)) {
          return next(
            new CustomError({
              name: 'BlockError',
              message: 'You have been blocked by this user',
              status: 403
            })
          )
        } else {
          return next()
        }
      })()
    }
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

module.exports = blocked
