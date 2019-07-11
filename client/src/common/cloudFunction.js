import Taro from "@tarojs/taro";

export const callFunction = (name, data) => new Promise((resolve, reject) => {
  Taro.cloud.callFunction({name, data}).then(res => {
    console.log(res.result);
    resolve(res.result);
  }).catch(e => {
    console.log(e);
    reject(e)
  });
});
