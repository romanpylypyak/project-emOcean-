const multer = require("multer")

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads")
  },
  filename: function (req, file, cb) {
    cb(null, req.userId + "-" + Date.now())
  }
})
const upload = multer({ storage: storage })

module.exports = upload

