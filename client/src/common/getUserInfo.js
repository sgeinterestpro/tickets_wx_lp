import Taro from "@tarojs/taro"
import {callFunction} from "./cloudFunction";

const login = () => new Promise((resolve, reject) => {
  console.info("login()");
  callFunction("login", {}).then((res) => {
    Taro.setStorageSync("OpenId", res.openid);
    resolve()
  }).catch(reject);
});

export {login}

