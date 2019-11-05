import Taro from "@tarojs/taro"
import {wxLogin} from "../apis";

const login = () => new Promise((resolve, reject) => {
  console.info("login()");
  if (process.env.TARO_ENV === 'weapp') {
    console.info("wx.login()");
    Taro.login().then(res => {
      console.log(res);
      if (res.code) {
        //发起网络请求
        wxLogin(res.code).then(res => {
          console.log(res);
          Taro.setStorageSync("OpenId", res.openid);
          resolve()
        }).catch(reject);
      } else {
        console.debug('登录失败！' + res.errMsg);
        reject(res)
      }
    }).catch(reject);
  } else if (process.env.TARO_ENV === 'alipay') {
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        console.log(res.authCode);
        // my.alert({
        //   content: res.authCode,
        // });
        Taro.request({
          url: "https://openapi.alipay.com/gateway.do",
          data: {
            "method": "alipay.system.oauth.toke"
          },
          header: {
            "content-type": "application/json",
          },
          method: "GET",
          dataType: "json"
        }).then(res => {
          Taro.hideNavigationBarLoading();
          if (res.statusCode >= 400) {
            console.error(res);
            reject(res.data);
          } else {
            console.debug(res);
            resolve(res.data);
          }
        }).catch(err => {
          Taro.hideNavigationBarLoading();
          console.error(err);
          reject(err)
        });
      },
    });
  }
});

export {login}

