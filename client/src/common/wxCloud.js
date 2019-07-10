import Taro from "@tarojs/taro";

const CloudCall = (name, data) => new Promise((resolve, reject) => {
  Taro.cloud.callFunction({name, data}).then(res => {
    console.log(res.result);
    resolve(res.result);
  }).catch(e => {
    console.log(e);
    reject(e)
  });
});

export default CloudCall;
