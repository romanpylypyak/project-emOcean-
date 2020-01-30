const fs = require('fs')
const path = require('path')

clearTempFiles = (directory, id) => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err
    for (const file of files) {
      if (file.includes(id)) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err
        })
      }
    }
  })
}

module.exports = clearTempFiles