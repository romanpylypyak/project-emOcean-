import { checkToken } from '@/services/auth.js'

export const isAuthorized = function () {
  return new Promise((resolve, reject) => {
    checkToken()
      .then((res) => {
        resolve(res.data.id === window.localStorage.getItem('profileId'))
      })
      .catch((err) => reject(err.response.data))
  })
}
