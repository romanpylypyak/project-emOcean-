const FfmpegHandler = require('./ffmpegHandler')
const convertToBuffer = require('../common/convertToBuffer')
const { uploadVideo } = require('../services/PostsService')

class VideoHandler {
  constructor(media, type, userId) {
    this.ffmpeg = new FfmpegHandler(media, type, userId)
  }
  apply () {
    return new Promise((resolve, reject) => {
      switch (this.ffmpeg.type) {
        case 'single-video':
          return this.ffmpeg.compressSingleFile().then(outputVideo => {
            convertToBuffer(outputVideo).then(buffer => {
              uploadVideo(buffer, this.ffmpeg.userId, 'videos').then(videoUrl => {
                return resolve(videoUrl)
              })
            })
          }).catch(err => {
            return reject(err)
          })
        case 'two-videos':
          return this.ffmpeg.extractAudioFromVideo().then(audioPath => {
            this.ffmpeg.mergeAudioAndVideo(audioPath).then(outputVideo => {
              convertToBuffer(outputVideo).then(buffer => {
                uploadVideo(buffer, this.ffmpeg.userId, 'videos').then(videoUrl => {
                  return resolve(videoUrl)
                })
              })
            })
          }).catch(err => {
            return reject(err)
          })
        case 'video-and-audio':
          return this.ffmpeg.mergeAudioAndVideo(this.ffmpeg.media[1].path).then(outputVideo => {
            convertToBuffer(outputVideo).then(buffer => {
              uploadVideo(buffer, this.ffmpeg.userId, 'videos').then(videoUrl => {
                return resolve(videoUrl)
              })
            })
          }).catch(err => {
            return reject(err)
          })
      }
    })
  }
}

module.exports = VideoHandler