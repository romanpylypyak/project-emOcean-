const { db, auth } = require('../config/databaseConfig')
const CustomError = require('../common/CustomError')
const nicknameKeywords = require('../common/nicknameKeywords')
const jwt = require('jsonwebtoken')

const createUserWithEmailAndPassword = async (email, password, nickname) => {
  const userProfilesRef = db.collection('users')
  const usersPostsRef = db.collection('users-posts')
  const userProfilesSnapshot = await userProfilesRef
    .where('nickname', '==', nickname)
    .get()
  if (userProfilesSnapshot.empty) {
    const keywords = nicknameKeywords.setKeywords(nickname)
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    )
    const batch = db.batch()
    const userId = user.uid
    const singleUserRef = userProfilesRef.doc(userId)
    const singleUserPostsRef = usersPostsRef.doc(userId)
    batch.set(singleUserRef, {
      nickname,
      email,
      userId,
      avatarUrl: '',
      backgroundUrl: '',
      preferences: [],
      followingsCount: 0,
      followersCount: 0,
      followingsId: [],
      blockedProfiles: [],
      likedPosts: [],
      keywords
    })
    batch.set(singleUserPostsRef, {
      nickname,
      avatarUrl: '',
      followers: [userId],
      posts: []
    })
    await batch.commit()
    return 'User successfully added'
  } else {
    {
      throw new CustomError({
        name: 'DatabaseError',
        message: 'Nickname already taken. Try with something else',
        status: 401
      })
    }
  }
}

const loginWithEmailAndPassword = async (email, password) => {
  const { user } = await auth().signInWithEmailAndPassword(email, password)
  return { uid: user.uid, email: user.email, password }
}

const changePassword = async (oldPassword, newPassword, email) => {
  const credential = auth.EmailAuthProvider.credential(email, oldPassword)
  await auth().signInWithCredential(credential)
  await auth().currentUser.updatePassword(newPassword)
  return 'Password changed'
}

const sendPasswordResetCode = async email => {
  auth().useDeviceLanguage()
  await auth().sendPasswordResetEmail(email)
  return 'Email sent'
}

const resetPassword = async (actionCode, newPassword) => {
  auth().useDeviceLanguage()
  await auth().confirmPasswordReset(actionCode, newPassword)
  return 'You can now sign in with your new password'
}

const signInWithGoogle = async tokenId => {
  const credential = auth.GoogleAuthProvider.credential(tokenId)
  const { user } = await auth().signInWithCredential(credential)
  return { uid: user.uid, email: user.email }
}

const deleteAccount = async token => {
  const { email, password, uid } = jwt.verify(
    token.split(' ')[1],
    process.env.JWT_SECRET
  ).value
  const userRef = db.collection('users').doc(uid)
  const userPostsRef = db.collection('users-posts').doc(uid)
  const postsRef = db.collection('posts')

  const userPostsDoc = await userPostsRef.get()
  const postIds = userPostsDoc.data().posts.map(post => post.postId)
  if (postIds !== []) {
    for (let i = 0; i < postIds.length; i++) {
      await postsRef.doc(postIds[i]).delete()
    }
  }

  const batch = db.batch()
  batch.delete(userRef)
  batch.delete(userPostsRef)
  await batch.commit()
  const credential = auth.EmailAuthProvider.credential(email, password)
  const { user } = await auth().signInWithCredential(credential)
  await user.delete()
  return 'User Deleted'
}

module.exports = {
  createUserWithEmailAndPassword,
  loginWithEmailAndPassword,
  sendPasswordResetCode,
  resetPassword,
  changePassword,
  signInWithGoogle,
  deleteAccount
}
