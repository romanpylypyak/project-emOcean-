const jwt = require('jsonwebtoken')
const CustomError = require('../common/CustomError')
const createJwtToken = require('../common/createToken')
const asyncMiddleware = require('../middleware/asyncMiddleware')
const authService = require('../services/AuthService')
const {
  validateEmail,
  validateNickname,
  validatePassword
} = require('../validation/auth')

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncMiddleware(async (req, res, next) => {
  const { email, password, nickname } = req.body

  const validatedEmailError = validateEmail(email)
  if (validatedEmailError !== undefined) {
    return next(new CustomError(validatedEmailError))
  }

  const validatedPasswordError = validatePassword(password)
  if (validatedPasswordError !== undefined) {
    return next(new CustomError(validatedPasswordError))
  }

  const validatedNicknameError = validateNickname(nickname)
  if (validatedPasswordError !== undefined) {
    return next(new CustomError(validatedNicknameError))
  }

  const message = await authService.createUserWithEmailAndPassword(
    email,
    password,
    nickname
  )
  res.status(200).json({ message })
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body

  const validatedEmailError = validateEmail(email)
  if (validatedEmailError !== undefined) {
    return next(new CustomError(validatedEmailError))
  }

  const validatedPasswordError = validatePassword(password)
  if (validatedPasswordError !== undefined) {
    return next(new CustomError(validatedPasswordError))
  }

  const currentUser = await authService.loginWithEmailAndPassword(
    email,
    password
  )

  const token = createJwtToken(currentUser)

  res.status(200).json({ token, myProfileId: currentUser.uid })
})

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = asyncMiddleware(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  const token = req.headers.authorization.split(' ')[1]
  const { email } = jwt.verify(token, process.env.JWT_SECRET).value

  const validatedPasswordError = validatePassword(newPassword)
  if (validatedPasswordError !== undefined) {
    return next(new CustomError(validatedPasswordError))
  }

  const message = await authService.changePassword(
    oldPassword,
    newPassword,
    email
  )

  res.status(200).json({ message })
})

// @desc    Send reset password code if forgot password
// @route   POST /api/auth/send-password-reset-code
// @access  Public
const sendPasswordResetCode = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body

  const validatedEmailError = validateEmail(email)
  if (validatedEmailError !== undefined) {
    return next(new CustomError(validatedEmailError))
  }

  const message = await authService.sendPasswordResetCode(email)

  res.status(200).json({ message })
})

// @desc    Reset password with new password and action oob Code
// @route   POST /api/auth/change-password
// @access  Public
const resetPassword = asyncMiddleware(async (req, res, next) => {
  const { oobCode, password } = req.body

  const validatedPasswordError = validatePassword(password)
  if (validatedPasswordError !== undefined) {
    return next(new CustomError(validatedPasswordError))
  }

  message = await authService.resetPassword(oobCode, password)

  res.status(200).json({ message })
})

// @desc    Sign in with google account
// @route   POST /api/auth/login-with-google
// @access  Public
const signInWithGoogle = asyncMiddleware(async (req, res) => {
  const { id_token } = req.body

  const user = await authService.signInWithGoogle(id_token)

  const token = createJwtToken(user)

  res.status(200).json({ token })
})

// @desc    Check if token correct
// @route   GET /api/auth/check-token
// @access  Private
const checkToken = asyncMiddleware(async (req, res) => {
  res.status(200).json({ id: req.userId })
})

const deleteAccount = asyncMiddleware(async (req, res) => {
  const token = req.headers.authorization

  const result = await authService.deleteAccount(token)

  res.status(200).json({ result })
})

module.exports = {
  register,
  checkToken,
  login,
  sendPasswordResetCode,
  changePassword,
  resetPassword,
  signInWithGoogle,
  deleteAccount
}
