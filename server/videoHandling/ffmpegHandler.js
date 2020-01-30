const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")
const ffmpeg = require("fluent-ffmpeg")

class FfmpegHandler {
  constructor(media, type, userId) {
    this.media = media
    this.type = type
    this.userId = userId
    this.outputVideo = './uploads/' + userId + '-video-result.mp4'
    this.outputAudio = './uploads/' + userId + '-audio.mp3'
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
  }
  compressSingleFile () {
    return new Promise((resolve, reject) => {
      ffmpeg(this.media[0].path)
        .videoCodec("libx264")
        .format("mp4")
        .on("error", err => {
          reject(err)
        })
        .on("end", () => {
          resolve(this.outputVideo)
        })
        .save(this.outputVideo)
    })
  }
  extractAudioFromVideo () {

    return new Promise((resolve, reject) => {
      ffmpeg(this.media[1].path)
        .on('error', err => {
          return reject(err)
        })
        .on('end', () => {
          return resolve(this.outputAudio)
        })
        .save(this.outputAudio)
    })
  }
  mergeAudioAndVideo (audioInput) {
    return new Promise((resolve, reject) => {
      ffmpeg(this.media[0].path)
        .addOption("-i", audioInput)
        .addOption("-vcodec", "copy")
        .addOption("-map", "0:0")
        .addOption("-map", "1:0")
        .format('mp4')
        .on('error', err => {
          return reject(err)
        })
        .on('end', () => {
          return resolve(this.outputVideo)
        })
        .save(this.outputVideo)
    })
  }
}

module.exports = FfmpegHandler
