import Taro from '@tarojs/taro'
import {callFunction} from "./cloudFunction";

const login = () => new Promise((resolve, reject) => {
  callFunction('login', {}).then((res) => {
    Taro.setStorageSync('OpenId', res.openid);
  });
});

export {login}

