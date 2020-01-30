const availableVideoFormats = [
  'video/mpeg',
  'video/ogg',
  'video/mp4',
  'video/webm'
]
const availableAudioFormats = [
  'audio/mpeg',
  'audio/ogg',
  'audio/wav'
]

const validateFilesCount = (files, count) => {
  if (!files || files.length !== count) {
    return {
      name: 'FileError',
      message:
        `You must upload ${count} file(s), but you upload ${files.length} file(s)`,
      status: 400
    }
  }
}
const validateFileFormat = (file, formats) => {
  if (!formats.includes(file.mimetype)) {
    return {
      name: 'FileError',
      message:
        'Incorrect file format. You need to upload file with' + formats + 'formats',
      status: 400
    }
  }
}
const validateFileSize = (file, acceptedFileSize) => {
  if (file.size > acceptedFileSize * 1000000) {
    return {
      name: 'FileError',
      message: `File is too large. Size limit is ${acceptedFileSize} mb`,
      status: 400
    }
  }
}
const validateFile = (file, acceptedSize, availableFormats) => {
  let validationError = validateFileFormat(file, availableFormats)
  if (!validationError) validationError = validateFileSize(file, acceptedSize)
  return validationError
}

const validateSingleVideo = (media, acceptedSize) => {
  let validationError = validateFilesCount(media, 1)
  if (!validationError) validationError = validateFile(media[0], acceptedSize, availableVideoFormats)
  return validationError
}
const validateTwoVideos = (media, acceptedSize) => {
  let validationError = validateFilesCount(media, 2)
  if (!validationError) validationError = validateFile(media[0], acceptedSize, availableVideoFormats)
  if (!validationError) validationError = validateFile(media[1], acceptedSize, availableVideoFormats)
  return validationError
}
const validateVideoAndAudio = (media, acceptedSize) => {
  let validationError = validateFilesCount(media, 2)
  if (!validationError) validationError = validateFile(media[0], acceptedSize, availableVideoFormats)
  if (!validationError) validationError = validateFile(media[1], acceptedSize, availableAudioFormats)
  return validationError
}

const validateInputMedia = (media, type) => {
  switch (type) {
    case 'single-video':
      return validateSingleVideo(media, 15)
    case 'two-videos':
      return validateTwoVideos(media, 10)
    case 'video-and-audio':
      validateVideoAndAudio(media, 10)
  }
}

module.exports = {
  validateInputMedia
}
