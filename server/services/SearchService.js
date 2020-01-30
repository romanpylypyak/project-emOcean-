const { db } = require('../config/databaseConfig')
const CustomError = require('../common/CustomError')

const searchByNick = nickname => {
  const userRef = db.collection('users')
  return userRef
    .where('keywords', 'array-contains', nickname.toLowerCase())
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        throw new CustomError({
          name: 'DatabaseError',
          message: 'No user has been found',
          status: 404
        })
      } else {
        const users = []
        snapshot.forEach(doc => {
          users.push(doc.data())
        })
        return users
      }
    })
    .catch(() => {
      throw new CustomError({
        name: 'DatabaseError',
        message: 'No user has been found',
        status: 404
      })
    })
}

const findByTag = (val) => {
  let postsRef = db.collection('posts');
  return postsRef.where('tag', 'array-contains', val).get()
}

module.exports = {
  searchByNick,
  findByTag
}
