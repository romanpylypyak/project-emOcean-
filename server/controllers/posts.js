const asyncMiddleware = require('../middleware/asyncMiddleware')
const postsService = require('../services/PostsService')
const profilesService = require('../services/ProfilesService')
const VideoHandler = require('../videoHandling/videoHandler')
const clearTempFiles = require('../common/clearTempFiles')
const CustomError = require('../common/CustomError')
const jwt = require('jsonwebtoken')

// @desc    Handling and uploading video to database
// @route   POST /api/posts/upload-videos?type=single-video
// @route   POST /api/posts/upload-videos?type=two-videos
// @route   POST /api/posts/upload-videos?type=video-and-audio
// @access  Private
const uploadVideos = asyncMiddleware(async (req, res) => {
  const { type } = req.query
  const media = req.files
  const id = req.userId
  const videoHandler = new VideoHandler(media, type, id)
  videoHandler
    .apply()
    .then(videoUrl => {
      res.status(200).json({ videoUrl })
    })
    .finally(() => {
      clearTempFiles('uploads', id)
    })
})

// @desc    Save post to database
// @route   POST /api/posts/save-post
// @access  Private
const savePost = asyncMiddleware(async (req, res) => {
  const id = req.userId
  const postData = req.body
  const result = await postsService.savePost(id, postData)
  res.status(200).json({ result })
})

const getPostsByType = asyncMiddleware(async (req, res, next) => {
  const typesList = ['search', 'preferences', 'followings', 'popular']
  const {
    type
  } = req.query
  const paginateId = req.query.index
  const postsLimit = 5
  let value
  if (typesList.includes(type)) {
    const postsActions = {
      search: 'searchPostsByQuery',
      preferences: 'getPostsByPreferences',
      popular: 'getPostsByViews',
      followings: 'getPostsByFollowings'
    }
    const postMethod = postsActions[type]
    if (type === 'preferences' || type === 'followings') {
      const token = req.headers.authorization.split(' ')[1]
      value = jwt.verify(token, process.env.JWT_SECRET).value.uid
    }
    if (type === 'search') {
      if (req.query.tags) {
        value = req.query.tags.split('-')
      } else {
        value = req.query.emoji
      }
    }
    const result = await postsService[postMethod](paginateId, postsLimit, value)
    res.status(200).json({
      result
    })
  } else {
    return next(
      new CustomError({
        name: 'Bad Request',
        message: 'Invalid query request',
        status: 400
      })
    )
  }
})

// @desc    Delete post by Id
// @route   DELETE /api/posts/delete-post/:postId
// @route   DELETE /api/posts/delete-post/qzmHM8GdAYWlgsrF9ZvZXXh8UK93
// @access  Private
const deletePost = asyncMiddleware(async (req, res) => {
  const userId = req.userId
  const { postId } = req.params
  const result = await postsService.deletePost(userId, postId)
  res.status(200).json({ result })
})

// @desc    Edit post by Id
// @route   PUT /api/posts/edit-post/:postId
// @route   PUT /api/posts/edit-post/qzmHM8GdAYWlgsrF9ZvZXXh8UK93
// @access  Private
const editPost = asyncMiddleware(async (req, res) => {
  const userId = req.userId
  const { postId } = req.params
  const { postData } = req.body
  const result = await postsService.editPost(userId, postId, postData)
  res.status(200).json({ result })
})

// @desc    Get posts by id
// @route   GET /api/posts/get-user-posts?id
// @route   GET /api/posts/get-user-posts?id=qzmHM8GdAYWlgsrF9ZvZXXh8UK93
// @access  Public
const getUserPosts = asyncMiddleware(async (req, res) => {
  const { id } = req.query
  const posts = await postsService.getUserPosts(id)
  res.status(200).json({
    result: posts
  })
})

const updateLikes = asyncMiddleware(async (req, res) => {
  const postId = req.params.postId
  const id = req.userId
  const result = await postsService.updateLikes(postId, id)
  res.status(200).json({
    result
  })
})

const incrementViewsCounter = asyncMiddleware(async (req, res) => {
  const post_id = req.params.postId
  const result = await postsService.incrementViewsCounter(post_id)
  res.status(200).json({
    result
  })
})

const getPostLikes = asyncMiddleware(async (req, res, next) => {
  const post_id = req.params.postId
  const users_ids = await postsService.getPostLikes(post_id)

  const result = []
  for (let i = 0; i < users_ids.length; i++) {
    const userInfo = await profilesService.getProfileById(users_ids[i].userId)
    userInfo.date = users_ids[i].date
    result.push(userInfo)
  }

  res.status(200).json({
    result
  })
})

const getUserLikedPosts = asyncMiddleware(async (req, res) => {
  const {
    id
  } = req.query
  const postsId = await postsService.getUserLikedPosts(id)

  const posts = []
  for (let i = 0; i < postsId.length; i++) {
    const post = await postsService.getPostInfo(postsId[i])
    posts.push(post)
  }
  res.status(200).json({
    result: posts
  })
})

module.exports = {
  savePost,
  deletePost,
  editPost,
  uploadVideos,
  updateLikes,
  incrementViewsCounter,
  getPostLikes,
  getUserLikedPosts,
  getUserPosts,
  getPostsByType
}
