import Taro from '@tarojs/taro'
import CloudCall from "./wxCloud";

const getUserInfo = () => new Promise((resolve, reject) => {
  Taro.getUserInfo().then(res => {
    if (res.userInfo) {
      Taro.setStorage({key: 'userInfo', data: res.userInfo});
      resolve(res)
    } else {
      reject(res)
    }
  }).catch(err => {
    reject(err)
  })
});

const login = () => new Promise((resolve, reject) => {
  CloudCall('login', {}).then((res) => {
    Taro.setStorageSync('OpenId', res.openid);
  });
});

export {getUserInfo, login}

