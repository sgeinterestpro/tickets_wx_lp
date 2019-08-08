const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
  const {ENV, OPENID, APPID, UNIONID} = cloud.getWXContext();
  cloud.updateConfig({env: ENV});
  return {event, openid: OPENID, appid: APPID, unionid: UNIONID,}
};
