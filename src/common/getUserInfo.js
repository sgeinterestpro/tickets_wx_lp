import Taro from '@tarojs/taro'

const getUserInfo = () => new Promise((resolve, reject) => {
  Taro.getUserInfo().then(res => {
    if (res.userInfo) {
      Taro.setStorage({key: 'userInfo', data: res.userInfo})
      resolve(res)
    } else {
      reject(res)
    }
  }).catch(err => {
    reject(err)
  })
})

const wxLogin = jsCode => new Promise((resolve, reject) => {
  Taro.request({
    url: `https://wx.benusmart.com/wx_login?js_code=${jsCode}&appid=wxcc7eb1363daedf9b&secret=fbd34476619c3f9f737fc193947a8dc2`,
  }).then(res => {
    resolve(res.data)
  }).catch(err => {
    reject(err)
  })
})

const login = () => new Promise((resolve, reject) => {
  Taro.login().then(resLogin => {
    if (!resLogin.code) {
      console.warn('获取jsCode失败', resLogin)
      reject('获取登录凭证失败')
      return
    }
    wxLogin(resLogin.code).then(resWxLogin => {
      Taro.setStorageSync('OpenId', resWxLogin.openid);
      Taro.setStorageSync('SessionKey', resWxLogin.session_key);
      resolve(resWxLogin)
    }).catch(errWxLogin => {
      console.warn('请求UnionId失败', errWxLogin)
      reject('微信登录数据错误')
    })
  }).catch(errLogin => {
    console.warn('微信登录失败', errLogin)
    reject(errLogin.errMsg.split(':')[2])
  })
})

export {getUserInfo, login}

