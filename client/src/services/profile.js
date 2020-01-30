import axios from 'axios'
const apiProfile = 'https://blooming-scrubland-72502.herokuapp.com/api/profiles'

export const updateProfile = editedData => axios.post(`${apiProfile}/save-profile`, editedData)

export const getProfile = params => axios.get(`${apiProfile}/get-profile`, { params })

export const uploadAvatar = (avatar, params) => axios.post(`${apiProfile}/upload-image`, avatar, { params })

export const uploadBackground = (background, params) => axios.post(`${apiProfile}/upload-image`, background, { params })

export const searchByNick = data => axios.post(`${apiProfile}/search-by-nick`, data)

export const profileAction = data => axios.get(`${apiProfile}/profile-action?action=${data.action}&id=${data.id}`)

export const getProfileById = id => axios.get(`${apiProfile}/get-profile?id=${id}`)

export const getProfileByNickname = nickname => axios.get(`${apiProfile}/get-profile?nickname=${nickname}`)

export const getSubscriptionsById = (id, type) => axios.get(`${apiProfile}/get-subscriptions?id=${id}&type=${type}`)

export const setPreferences = data => axios.post(`${apiProfile}/set-preferences`, data)
