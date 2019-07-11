/**
 * 代码来源：https://github.com/guren-cloud/v-request
 * 作者：guren-cloud
 * @param options
 * @returns {Promise<any>}
 */
import Taro from "@tarojs/taro";
export const cloudRequest = function (options) {
  // 默认配置
  const OPT = Object.assign({
    method: 'GET',
    // dataType: 'json',
    responseType: 'text'
  }, options);

  // 默认header
  OPT['header'] = Object.assign({
    'Content-Type': 'application/json',
    // 'UserAgent': 'github@guren-cloud/v-request 20181229'
  }, options.header);

  // 发送的数据
  // 如果data是string,对应request模块的body（buffer、string）
  // 如果是object，则为json，对应request模块的json
  let POST_DATA = {
    body: options.data
  };
  if (typeof options.data === 'object') POST_DATA['body'] = JSON.stringify(POST_DATA['body']);

  // 开始请求
  return new Promise((RES, REJ) => {
    Taro.cloud.callFunction({
      name: 'cloud_request',
      data: {
        options: Object.assign({
          url: options.url,
          method: OPT['method'],
          headers: OPT['header']
        }, POST_DATA)
      },
      success: res => {
        const {result} = res;
        // 如果datatype='json'，则解析后
        let data = null;
        if (OPT.dataType === 'json') {
          try {
            data = JSON.parse(result.body);
          } catch (err) {
            console.error('[!] cloudRequest： 解析返回数据json失败', err);
          }
        } else {
          // 否则为text数据
          data = result.body;
        }

        const RETURN_DATA = {
          data,
          errMsg: 'request:ok',
          statusCode: result.statusCode,
          header: result.headers
        };

        options.success && options.success(RETURN_DATA);
        RES(RETURN_DATA);
      },
      fail: err => {
        // 错误回调
        options.fail && options.fail({
          errMsg: 'request:fail',
          err
        });
        REJ(err);
      },
      complete: options.complete
    })
  })
};
