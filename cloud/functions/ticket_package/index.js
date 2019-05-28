/**
 * FunctionName: ticket_package
 * Description: 查看当前用户拥有的票券（供用户查看）
 * Author: muumlover
 * Date: 2019-05-06
 */

// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const userInfo = event.userInfo;
  const thisWeeks = [0, 1, 2, 3, 4, 5, 6].map(item => getWeekDay(item));

  return await db.collection('ticket').where({
    purchaser: userInfo.openId,
    date: _.in(thisWeeks)
  }).get().then(res => {
    console.log(res);
    return {count: res.data.length, message: res.errMsg, items: res.data};
  }).catch((e) => {
    console.error(e);
    return {code: -3, 'message': '获取票券列表出错', msg_ex: e.errMsg}
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
