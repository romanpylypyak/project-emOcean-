const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const protected = require('../middleware/protectRoute')
const blocked = require('../middleware/blockedUser')
const {
  searchByNick,
  getProfile,
  saveProfile,
  uploadImage,
  setPreferences,
  getSubscriptionsById,
  profileAction
} = require('../controllers/profiles')

// edit profile
router.post('/save-profile', protected, saveProfile)
router.post('/upload-image', protected, upload.single('file'), uploadImage)

// get some profiles
router.get('/get-profile', blocked, getProfile)

// profile actions (Block, unblock, follow, unfollow)
router.get('/profile-action', protected, blocked, profileAction)

// preferences
router.post('/set-preferences', protected, setPreferences)

// Followers followings
router.get('/get-subscriptions', getSubscriptionsById)

// Search logic
router.post('/search-by-nick', searchByNick)

module.exports = router
