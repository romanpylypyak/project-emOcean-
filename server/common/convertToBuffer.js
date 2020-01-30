const fs = require('fs')

const convertToBuffer = (input) => {
  return new Promise((resolve, reject) => {
    fs.readFile(input, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

module.exports = convertToBuffer