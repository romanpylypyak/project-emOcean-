import axios from 'axios'
const apiAuth = 'https://blooming-scrubland-72502.herokuapp.com/api/auth'

export const setApiAuthorizationHeaders = function (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export const register = (data) => axios.post(`${apiAuth}/register`, data)

export const login = (data) => axios.post(`${apiAuth}/login`, data)

export const googleSignIn = (data) => axios.post(`${apiAuth}/login-with-google`, data)

export const forgot = (data) => axios.post(`${apiAuth}/send-password-reset-code`, data)

export const resetPass = (data) => axios.post(`${apiAuth}/reset-password`, data)

export const changePassword = (data) => axios.post(`${apiAuth}/change-password`, data)

export const checkToken = () => axios.get(`${apiAuth}/check-token`)

export const deleteAccount = (params) => axios.delete(`${apiAuth}/delete-account`, { data: params })
