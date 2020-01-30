const CustomError = require('../common/CustomError')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const profilesService = require('../services/ProfilesService')
const searchService = require('../services/SearchService')
const { validateImage } = require('../validation/profiles')

const searchByNick = asyncMiddleware(async (req, res, next) => {
  const { nickname } = req.body
  const message = await searchService.searchByNick(nickname)
  res.status(200).json({ message })
})

const getProfile = asyncMiddleware(async (req, res, next) => {
  const { nickname, id } = req.query
  if (!nickname && !id) {
    return next(
      new CustomError({
        name: 'Bad Request',
        message: 'Invalid query request',
        status: 400
      })
    )
  } else {
    const profile = id
      ? await profilesService.getProfileById(id)
      : await profilesService.getProfileByNickname(nickname)
    res.status(200).json({ profile })
  }
})

const uploadImage = asyncMiddleware(async (req, res, next) => {
  const { type } = req.query
  const image = req.file
  const id = req.userId
  if (type && image) {
    let validatedImageError, dest
    switch (type) {
      case 'background': {
        validatedImageError = validateImage(image, 10)
        dest = type + 's'
        break
      }
      case 'avatar': {
        validatedImageError = validateImage(image, 5)
        dest = type + 's'
        break
      }
      default: {
        return next(
          new CustomError({
            name: 'Bad Request',
            message:
              'Incorrect query. Make sure that you entered correct image type',
            status: 400
          })
        )
      }
    }
    if (validatedImageError !== undefined) {
      return next(new CustomError(validatedImageError))
    }
    const imageUrl = await profilesService.uploadPhoto(image, id, dest)
    res.status(200).json({ imageUrl })
  } else {
    return next(
      new CustomError({
        name: 'Bad Request',
        message: 'Incorrect query. Make sure that you send query image type',
        status: 400
      })
    )
  }
})

const saveProfile = asyncMiddleware(async (req, res) => {
  const id = req.userId
  const userData = req.body
  const result = await profilesService.saveProfile(userData, id)

  res.status(200).json({ result })
})

const setPreferences = asyncMiddleware(async (req, res) => {
  const { preferences } = req.body
  const id = req.userId
  const result = await profilesService.setPreferences(preferences, id)

  res.status(200).json({ result })
})

const getSubscriptionsById = asyncMiddleware(async (req, res, next) => {
  const subscriptionsList = ['followings', 'followers']
  const profileId = req.query.id
  const paginationId = req.query.pagination
  const type = req.query.type
  if (!type || !subscriptionsList.includes(type) || !profileId) {
    return next(
      new CustomError({
        name: 'Bad Request',
        message: 'Invalid query request',
        status: 400
      })
    )
  }
  const usersLimit = 10
  const result = await profilesService.getSubscriptionsById(
    type,
    profileId,
    usersLimit,
    paginationId
  )
  res.status(200).json({ result })
})

const profileAction = asyncMiddleware(async (req, res, next) => {
  const actionsList = ['follow', 'unfollow', 'block', 'unblock']
  const { action, id } = req.query

  if (action && id && actionsList.includes(action)) {
    const myProfileId = req.userId
    const profileActions = {
      follow: 'followProfileAction',
      unfollow: 'followProfileAction',
      block: 'blockProfileAction',
      unblock: 'blockProfileAction'
    }
    const followMethod = profileActions[action]
    const result = await profilesService[followMethod](myProfileId, id, action)
    res.status(200).json({ result })
  } else {
    return next(
      new CustomError({
        name: 'Bad Request',
        message: 'Invalid query request',
        status: 400
      })
    )
  }
})

module.exports = {
  searchByNick,
  getProfile,
  saveProfile,
  uploadImage,
  setPreferences,
  profileAction,
  getSubscriptionsById
}
