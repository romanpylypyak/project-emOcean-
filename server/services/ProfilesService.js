const { db, storage } = require('../config/databaseConfig')
const CustomError = require('../common/CustomError')

const uploadPhoto = async (photo, userId, dest) => {
  const metaData = {
    contentType: photo.mimetype
  }
  const imageRef = storage.ref().child(`${dest}/${userId}`)
  await imageRef.put(photo.buffer, metaData)
  return await imageRef.getDownloadURL()
}

const saveProfile = async (profile, userId) => {
  const profileRef = db.collection('users').doc(userId)
  const userPostsRef = db.collection('users-posts').doc(userId)

  const doc = await profileRef.get()
  const { nickname: prevNickname, avatarUrl: prevAvatar } = doc.data()
  const profileFields = {
    bio: profile.bio,
    status: profile.status,
    socialAccounts: profile.socialAccounts,
    backgroundUrl: profile.backgroundUrl
  }

  try {
    const userNameExists = await getProfileByNickname(profile.nickname)
    if (prevNickname !== userNameExists.nickname) {
      throw new CustomError({
        name: 'DatabaseError',
        message: 'Nickname already taken. Try with something else',
        status: 400
      })
    }
  } catch (error) {
    if (error.message !== 'No profile with given nickname') {
      throw error
    }
  }

  await db.runTransaction(async t => {

    if (prevNickname !== profile.nickname) {
      profileFields.nickname = profile.nickname
    }
    if (prevAvatar !== profile.avatarUrl) {
      profileFields.avatarUrl = profile.avatarUrl
    }
    t.update(profileRef, profileFields)

    if (profileFields.nickname || profileFields.avatarUrl) {
      t.update(userPostsRef, {
        avatarUrl: profile.avatarUrl || prevAvatar,
        nickname: profile.nickname || prevNickname
      })
    }
  })
  return 'Profile saved successfully'
}

const getProfileById = async userId => {
  const profileRef = db.collection('users').doc(userId)
  const doc = await profileRef.get()
  if (!doc.exists) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No profile with given id',
      status: 404
    })
  } else {
    return doc.data()
  }
}

const getProfileByNickname = async userNickname => {
  const profilesRef = db
    .collection('users')
    .where('nickname', '==', userNickname)
  const profile = await profilesRef.get()
  if (profile.empty) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No profile with given nickname',
      status: 404
    })
  }
  return profile.docs[0].data()
}

const setPreferences = async (preferences, userId) => {
  const profileRef = db.collection('users').doc(userId)
  const doc = await profileRef.get()
  if (!doc.exists) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No profile with given id',
      status: 404
    })
  }
  await profileRef.update({ preferences })
  return 'Preferences successfully set'
}

const followProfileAction = async (myId, followId, action) => {
  const {
    myProfileRef,
    followProfileRef,
    myProfileFollowingsRef,
    followProfileFollowersRef,
    userPostsRef } = followRefGetter(myId, followId)
  return await db.runTransaction(async transaction => {
    let message
    const myProfileDoc = await transaction.get(myProfileRef)
    const followProfileDoc = await transaction.get(followProfileRef)
    const myFollowingsDoc = await transaction.get(myProfileFollowingsRef)
    const followProfileFollowersDoc = await transaction.get(followProfileFollowersRef)
    const userPostsDoc = await transaction.get(userPostsRef)
    let { followingsId, followingsCount } = myProfileDoc.data()
    let { followersCount } = followProfileDoc.data()
    let { followers } = userPostsDoc.data()

    if (action === 'follow') {
      message = 'User succesfully followed'
      if (
        myFollowingsDoc.exists &&
        followProfileFollowersDoc.exists &&
        followingsId.includes(followId)
      ) {
        throw new CustomError({
          name: 'DatabaseError',
          message: 'You already follow this user',
          status: 400
        })
      } else {
        followers.push(myId)
        followingsId.push(followId)
        const actionDate = Date.now()
        transaction.set(myProfileFollowingsRef, { id: followId, actionDate })
        transaction.set(followProfileFollowersRef, { id: myId, actionDate })
      }
    }
    if (action === 'unfollow') {
      message = 'User succesfully unfollowed'
      if (!myFollowingsDoc.exists || !followProfileFollowersDoc.exists) {
        throw new CustomError({
          name: 'DatabaseError',
          message: 'You are not following this user',
          status: 400
        })
      } else {
        followers = followers.filter(id => id !== myId)
        followingsId = followingsId.filter(id => id !== followId)
        transaction.delete(myProfileFollowingsRef)
        transaction.delete(followProfileFollowersRef)
      }
    }
    const subAdjustment = action === 'follow' ? 1 : -1
    transaction.update(myProfileRef, {
      followingsCount: followingsCount + subAdjustment,
      followingsId
    })
    transaction.update(followProfileRef, {
      followersCount: followersCount + subAdjustment
    })
    transaction.update(userPostsRef, { followers })
    return message
  })
}

const blockProfileAction = async (myId, blockedId, action) => {
  if (myId === blockedId) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'You can\'t perform this action with yourself',
      status: 400
    })
  }
  return await db.runTransaction(async t => {
    const refs = blockRefGetter(myId, blockedId, action)
    const { myProfileRef } = refs
    const myProfileDoc = await t.get(myProfileRef)
    const { blockedProfiles } = myProfileDoc.data()
    let newBlockedProfiles, message
    if (action === 'block') {
      message = 'User successfully blocked'
      const { blockedProfileRef, myPostsRef, blockedFollowingsRef, myFollowersRef } = refs
      const blockedProfileDoc = await t.get(blockedProfileRef)
      const { followingsId } = blockedProfileDoc.data()
      if (blockedProfiles.includes(blockedId)) {
        throw new CustomError({
          name: 'DatabaseError',
          message: 'You already blocked this user',
          status: 404
        })
      } else {
        if (!followingsId.includes(myId)) {
          newBlockedProfiles = [...blockedProfiles, blockedId]
          t.update(blockedProfileRef, { followingsId })
        }
        else {
          const myPostsDoc = await t.get(myPostsRef)
          const newFollowingsIdArray = followingsId.filter(id => id !== myId)
          const newFollowersArray = myPostsDoc
            .data()
            .followers.filter(id => id !== blockedId)
          const newFollowingsCount = blockedProfileDoc.data().followingsCount - 1
          const newFollowersCount = myProfileDoc.data().followersCount - 1
          t.update(myProfileRef, { followersCount: newFollowersCount })
          t.update(blockedProfileRef, {
            followingsId: newFollowingsIdArray,
            followingsCount: newFollowingsCount
          })
          t.update(myPostsRef, { followers: newFollowersArray })
          t.delete(blockedFollowingsRef)
          t.delete(myFollowersRef)
        }
      }
    }
    if (action === 'unblock') {
      message = 'User succesfully unblocked'
      if (blockedProfiles.includes(blockedId)) {
        newBlockedProfiles = blockedProfiles.filter(id => id !== blockedId)
      } else {
        throw new CustomError({
          name: 'DatabaseError',
          message: 'No blocked profile with given id',
          status: 404
        })
      }
    }
    await t.update(myProfileRef, { blockedProfiles: newBlockedProfiles })
    return message
  })
}

const getSubscriptionsById = async (type, profileId, usersLimit, paginationId) => {
  const profilesRef = db.collection('users')
  let subscriptionsQueryRef = db.collection(`users/${profileId}/${type}`)
    .limit(usersLimit)
    .orderBy('actionDate', 'desc')
  if (paginationId) {
    const paginateRef = db.collection('users').doc(profileId)
    const snapshot = await paginateRef.get()
    subscriptionsQueryRef = subscriptionsQueryRef.startAfter(snapshot)
  }
  const docSnapshots = await subscriptionsQueryRef.get()
  const { length } = docSnapshots.docs
  if (length > 0) {
    const lastIndex =
      length >= usersLimit
        ? docSnapshots.docs[length - 1].id
        : 'Last index'
    const profiles = []
    for (doc of docSnapshots.docs) {
      const profileDoc = await profilesRef.doc(doc.id).get()
      profiles.push(profileDoc.data())
    }
    return { data: profiles, lastIndex }
  } else {
    return 'No more users left'
  }
}

const followRefGetter = (myId, followActionId) => {
  if (myId === followActionId) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'You can\'t perform action with yourself',
      status: 400
    })
  }
  return {
    myProfileRef: db.collection('users').doc(myId),
    myProfileFollowingsRef: db
      .collection('users')
      .doc(myId)
      .collection('followings')
      .doc(followActionId),
    followProfileRef: db.collection('users').doc(followActionId),
    followProfileFollowersRef: db
      .collection('users')
      .doc(followActionId)
      .collection('followers')
      .doc(myId),
    userPostsRef: db.collection('users-posts').doc(followActionId)
  }
}

const blockRefGetter = (myId, blockedId, action) => {
  const refs = { myProfileRef: db.collection('users').doc(myId) }
  if (action === 'block') {
    refs.blockedProfileRef = db.collection('users').doc(blockedId)
    refs.myPostsRef = db.collection('users-posts').doc(myId)
    refs.myFollowersRef = db
      .collection('users')
      .doc(myId)
      .collection('followers')
      .doc(blockedId)
    refs.blockedFollowingsRef = db.collection('users').doc(blockedId).collection('followings').doc(myId)
  }
  return refs
}

module.exports = {
  saveProfile,
  setPreferences,
  getProfileById,
  blockProfileAction,
  followProfileAction,
  getProfileByNickname,
  uploadPhoto,
  getSubscriptionsById
}
