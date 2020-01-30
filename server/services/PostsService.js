const { db, storage } = require('../config/databaseConfig')
const CustomError = require('../common/CustomError')

const uploadVideo = async (video, userId, dest) => {
  const metaData = { contentType: video.mimetype }
  const videoRef = storage.ref().child(`${dest}/${userId}/${Date.now()}`)
  await videoRef.put(video.buffer, metaData)
  return videoRef.getDownloadURL()
}

const searchPostsByQuery = async (paginateId, postsLimit, query) => {
  let postsRefQuery = db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .limit(postsLimit)
  if (typeof query === 'object') {
    postsRefQuery = postsRefQuery.where('tags', 'array-contains-any', query)
  } else {
    postsRefQuery = postsRefQuery.where('emoji', '==', query)
  }
  // if (typeof query === 'string') {
  //   postsRefQuery = postsRefQuery.where('emoji', '==', query)
  // }
  return await getPostsByQuery(postsRefQuery, paginateId, postsLimit)
}

const savePost = async (userId, postData) => {
  const { caption, videoUrl, emoji, tags } = postData
  const createdAt = Date.now()
  const userPostsRef = db.collection('users-posts').doc(userId)
  const newPostRef = db.collection('posts').doc()
  const post = await db.runTransaction(async transaction => {
    const userPostsDoc = await transaction.get(userPostsRef)
    const newPostId = newPostRef.id
    const { nickname, posts, avatarUrl } = userPostsDoc.data()
    posts.push({
      caption,
      videoUrl,
      userId,
      tags,
      createdAt,
      emoji,
      postId: newPostId,
      views: 0,
      likes: [],
      likesCount: 0
    })
    transaction.set(newPostRef, {
      ...postData,
      createdAt,
      nickname,
      postId: newPostId,
      avatarUrl,
      userId,
      emoji,
      likes: [],
      likesCount: 0,
      views: 0
    })
    transaction.update(userPostsRef, { posts, lastAction: createdAt })
    return {
      ...postData,
      createdAt,
      nickname,
      postId: newPostId,
      avatarUrl,
      emoji,
      userId,
      likes: [],
      likesCount: 0,
      views: 0
    }
  })
  return post
}

const getPostsByViews = async (paginateId, postsLimit) => {
  let postsRefQuery = db
    .collection('posts')
    .orderBy('views', 'desc')
    .limit(postsLimit)
  return await getPostsByQuery(postsRefQuery, paginateId, postsLimit)
}

const getPostsByPreferences = async (paginateId, postsLimit, id) => {
  const userProfileRef = db.collection('users').doc(id)
  const userDoc = await userProfileRef.get()
  const { preferences } = userDoc.data()
  if (preferences.length === 0) {
    throw new CustomError({
      name: 'Bad Request',
      message: 'No more posts left',
      status: 400
    })
  }
  let postsRefQuery = db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .where('tags', 'array-contains-any', preferences)
    .limit(postsLimit)
  return await getPostsByQuery(postsRefQuery, paginateId, postsLimit)
}

const getPostsByFollowings = async (index, postsLimit, id) => {
  let lastCreated, lastAction, lastIndex
  let postsQueryRef = db
    .collection('users-posts')
    .where('followers', 'array-contains', id)
    .limit(postsLimit)
    .orderBy('lastAction', 'desc')
  if (index) {
    const indexArray = index.split('-')
    lastCreated = indexArray[0]
    lastAction = indexArray[1]
    postsQueryRef = postsQueryRef.startAt(lastAction)
  }
  const snapshots = await postsQueryRef.get()
  let postsArray = []
  for (snap of snapshots.docs) {
    const { nickname, posts, avatarUrl, lastAction } = snap.data()
    postsArray = [
      ...postsArray,
      ...posts.filter(post => {
        if (!lastCreated || post.createdAt < lastCreated) {
          post.nickname = nickname
          post.avatarUrl = avatarUrl
          post.lastAction = lastAction
          return post
        }
      })
    ]
  }
  postsArray.sort((a, b) => b.createdAt - a.createdAt)
  if (postsArray.length < postsLimit) {
    lastIndex = 'Last index'
  } else {
    const lastPost = postsArray[postsLimit - 1]
    lastIndex = lastPost.createdAt + '-' + lastPost.lastAction
    postsArray.length = postsLimit
  }
  return { data: postsArray, lastIndex }
}

const deletePost = async (userId, postId) => {
  const postRef = db.collection('posts').doc(postId)
  const userPostsRef = db.collection('users-posts').doc(userId)
  await db.runTransaction(async t => {
    const postDoc = await t.get(postRef)
    const userPostsDoc = await t.get(userPostsRef)
    const userIdFromPost = postDoc.data().userId
    if (userIdFromPost === userId) {
      const storageRef = storage.refFromURL(postDoc.data().videoUrl)
      const { posts } = userPostsDoc.data()
      const newPosts = posts.filter(post => post.postId !== postId)
      await storageRef.delete()
      t.delete(postRef)
      t.update(userPostsRef, { posts: newPosts })
    } else {
      throw new CustomError({
        name: 'DatabaseError',
        message: 'You are not owner of this post',
        status: 401
      })
    }
  })
  return 'Post deleted'
}

const editPost = async (userId, postId, postData) => {
  const { caption, emoji, tags } = postData
  const postRef = db.collection('posts').doc(postId)
  const userPostsRef = db.collection('users-posts').doc(userId)
  await db.runTransaction(async t => {
    const postDoc = await t.get(postRef)
    const userIdFromPost = postDoc.data().userId
    if (userIdFromPost === userId) {
      posts.map(post => {
        if (post.id === postId) {
          post.caption = caption
          post.emoji = emoji
          post.tags = tags
        }
      })
      t.update(postRef, { caption, emoji, tags })
      t.update(userPostsRef, { posts })
    } else {
      throw new CustomError({
        name: 'DatabaseError',
        message: 'You are not owner of this post',
        status: 401
      })
    }
  })
  return 'Post edited'
}

const getUserPosts = async userId => {
  const userRef = db.collection('users-posts').doc(userId)
  const doc = await userRef.get()
  if (!doc.exists) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No user with given id',
      status: 404
    })
  }
  const { nickname, posts, avatarUrl } = doc.data()
  if (posts.length <= 0) {
    throw new CustomError({
      name: 'DatabaseError',
      message: "This you user don't have any posts",
      status: 404
    })
  } else {
    return posts.map(post => {
      post.nickname = nickname
      post.avatarUrl = avatarUrl
      return post
    }).reverse()
  }
}

const getPostsByQuery = async (query, paginateId, postsLimit) => {
  let postsRefQuery = query
  if (paginateId) {
    const paginateRef = db.collection('posts').doc(paginateId)
    const snapshot = await paginateRef.get()
    postsRefQuery = query.startAfter(snapshot)
  }
  const docSnapshots = await postsRefQuery.get()
  const {
    length
  } = docSnapshots.docs
  if (length > 0) {
    const lastIndex =
      length >= postsLimit ?
      docSnapshots.docs[length - 1].id :
      'Last index'
    const data = []
    docSnapshots.forEach(doc => {
      data.push(doc.data())
    })
    return {
      data,
      lastIndex
    }
  } else {
    throw new CustomError({
      name: 'Bad Request',
      message: 'No more posts left',
      status: 404
    })
  }
}

const updateLikes = async (postId, userId) => {
  const postRef = db.collection('posts').doc(postId)
  return await db.runTransaction(async t => {
    const docPost = await t.get(postRef)
    const postOwnerId = docPost.data().userId
    const userPostsRef = db.collection('users-posts').doc(postOwnerId)
    const myPostsRef = db.collection('users-posts').doc(userId)
    const userPostsDoc = await t.get(userPostsRef)
    const myPostsDoc = await t.get(myPostsRef)
    const {
      likes,
      likesCount
    } = docPost.data()
    const {
      posts
    } = userPostsDoc.data()
    const likedPosts = myPostsDoc.data().likedPosts || []
    console.log(likedPosts)
    console.log(postId)
    let like = (!likedPosts.includes(postId)) ? true : false
    const newLike = {
      userId: userId,
      date: Date.now()
    }

    const newLikes = (like) ? [...likes, newLike] : likes.filter(el => el.userId !== userId)
    const newLikesCount = (like) ? likesCount + 1 : likesCount - 1
    const newLikedPosts = (like) ? [...likedPosts, postId] : likedPosts.filter(el => el !== postId)
    const newPosts = posts.map(post => {
      if (post.postId === postId) {
        (like) ? post.likesCount++: post.likesCount--
        post.likes = newLikes
      }
      return post
    })
    t.update(postRef, {
      likes: newLikes,
      likesCount: newLikesCount
    })
    t.update(userPostsRef, {
      posts: newPosts
    })
    t.update(myPostsRef, {
      likedPosts: newLikedPosts
    })
    return like ? 'like' : 'dislike'
  })
}

const incrementViewsCounter = async (postId) => {
  const postRef = db.collection('posts').doc(postId)
  return await db.runTransaction(async t => {
    const docPost = await t.get(postRef)
    const postOwnerId = docPost.data().userId
    const userPostsRef = db.collection('users-posts').doc(postOwnerId)

    const userPostsDoc = await t.get(userPostsRef)
    const ownerPosts = userPostsDoc.data().posts
    let views = docPost.data().views || 0
    views++
    t.update(postRef, {
      views: views
    })
    t.update(userPostsRef, {
      posts: ownerPosts.map(post => {
        if (post.postId === postId) {
          post.views = views
        }
        return post
      })
    })
    return views
  })
}

const getUserLikedPosts = async (userId) => {
  const userRef = db.collection('users-posts').doc(userId)
  const doc = await userRef.get()
  if (!doc.exists) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No user with given id',
      status: 404
    })
  }
  const postsId = doc.data().likedPosts || []
  return postsId
}

const getPostLikes = async (postId) => {
  const postRef = db.collection('posts').doc(postId)
  const doc = await postRef.get()
  if (!doc.exists) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No post with given id',
      status: 404
    })
  }
  const likesArr = doc.data().likes || []
  return likesArr
}

const getPostInfo = async (postId) => {
  const postRef = db.collection('posts').doc(postId)
  const doc = await postRef.get()
  if (!doc.exists) {
    throw new CustomError({
      name: 'DatabaseError',
      message: 'No post with given id',
      status: 404
    })
  }
  const info = doc.data() || []
  return info
}

module.exports = {
  uploadVideo,
  updateLikes,
  incrementViewsCounter,
  getUserLikedPosts,
  getPostInfo,
  savePost,
  editPost,
  deletePost,
  getPostsByViews,
  getPostsByFollowings,
  searchPostsByQuery,
  getPostsByPreferences,
  getUserPosts,
  getPostLikes
}
