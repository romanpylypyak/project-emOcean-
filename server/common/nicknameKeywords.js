module.exports = {
  setKeywords (nickname) {
    const characters = []
    let curName = ''
    nickname.split('').forEach((letter) => {
      curName += letter.toLowerCase()
      characters.push(curName)
    })
    return characters
  }
}