const { validateInputMedia } = require('../validation/posts')
const clearTempFiles = require('../common/clearTempFiles')
const CustomError = require("../common/CustomError")

const mediaValidation = (req, res, next) => {
  const availableVideoActions = ['single-video', 'two-videos', 'video-and-audio']
  const { type } = req.query
  const id = req.userId
  const media = req.files
  let validateMedia

  if (availableVideoActions.includes(type)) {
    validateMedia = validateInputMedia(media, type)
  } else {
    clearTempFiles('uploads', id)
    next(new CustomError({
      name: 'ClientError',
      message: 'Bad action video type. You can use next actions single-video, two-videos or video-and-audio',
      status: 400
    }))
  }
  if (validateMedia) {
    clearTempFiles('uploads', id)
    next(new CustomError(validateMedia))
  } else {
    next()
  }
}

module.exports = mediaValidation
