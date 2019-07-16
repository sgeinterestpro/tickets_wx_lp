import Taro from "@tarojs/taro";

export const callFunction = (name, data) => new Promise((resolve, reject) => {
  console.info(`callFunction(${name},${JSON.stringify(data)})`);
  Taro.cloud.callFunction({name, data}).then(res => {
    console.debug(res.result);
    resolve(res.result);
  }).catch(err => {
    console.error(err);
    reject(err)
  });
});
