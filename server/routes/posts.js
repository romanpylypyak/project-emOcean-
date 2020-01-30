const express = require('express')
const router = express.Router()
const protectedMiddleware = require('../middleware/protectRoute')
const mediaValidation = require('../middleware/mediaValidation')
const upload = require('../config/multerConfig')
const {
  savePost,
  uploadVideos,
  getUserLikedPosts,
  updateLikes,
  incrementViewsCounter,
  getPostLikes,
  editPost,
  deletePost,
  getUserPosts,
  getPostsByType
} = require('../controllers/posts')

router.post(
  '/upload-videos',
  protectedMiddleware,
  upload.array('file', 2),
  mediaValidation,
  uploadVideos
)
router.post('/save-post', protectedMiddleware, savePost)

router.post("/upload-videos", protectedMiddleware, upload.array("file", 2), mediaValidation, uploadVideos)

router.get('/get-user-liked-posts', getUserLikedPosts)
router.get('/like-post/:postId', protectedMiddleware, updateLikes)
router.get('/increment-views-counter/:postId', incrementViewsCounter)
router.get('/get-post-likes/:postId', getPostLikes)
router.delete('/delete-post/:postId', protectedMiddleware, deletePost)
router.put('/edit-post/:postId', protectedMiddleware, editPost)

router.get('/get-user-posts', getUserPosts)
router.get('/get-posts', getPostsByType)

module.exports = router;
