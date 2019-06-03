const request = require('request');
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = (evt, ctx) => {
  const wxContext = cloud.getWXContext();
  return new Promise((RES, REJ) => {
    evt.options.headers['open-id'] = wxContext.OPENID;
    request(evt.options, (err, res, body) => {
      if (err) return REJ(err);
      RES(res);
    })
  });
};
