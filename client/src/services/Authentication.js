import Api from '@/services/Api'

export default {
  loginUser(params) {
    return Api().post('auth/login', params)
  },
}
