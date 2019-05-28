// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const thisWeeks = [0, 1, 2, 3, 4, 5, 6].map(item => getWeekDay(item));

  return await db.collection('user').where({
    _id: wxContext.OPENID
  }).count().then(res => {
    console.log('user.total', res.total);
    if (res.total === 0) {
      console.log('create.user');
      return db.collection('user').doc(wxContext.OPENID).set({
        data: {weekly_limit: 3, quota_used: 0}
      });
    }
  }).then(() => {
    console.log('ticket.total');
    return db.collection('ticket').where({
      purchaser: wxContext.OPENID,
      date: _.in(thisWeeks)
    }).count();
  }).then(res => {
    console.log('ticket.total',res.total);
    console.log('update.user');
    return db.collection('user').doc(wxContext.OPENID).update({
      data: {
        quota_used: _.set(res.total)
      }
    });
  }).then(() => {
    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  });
};

const dateToString = (date) => {
  const year = date.getFullYear().toString();
  let month = (Number(date.getMonth()) + 1).toString();
  let day = (date.getDate()).toString();
  month = (month.length === 1) ? '0' + month : month;
  day = (day.length === 1) ? '0' + day : day;
  return year + "-" + month + "-" + day;
};

const getWeekDay = (i) => {
  let now = new Date();
  let firstDay = new Date(now - (now.getDay() - 1) * 86400000);
  firstDay.setDate(firstDay.getDate() + i);
  return dateToString(firstDay)
};
