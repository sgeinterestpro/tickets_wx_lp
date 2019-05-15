/**
 * FunctionName: ticket_expire
 * Description: 票券过期
 * Author: muumlover
 * Date: 2019-05-15
 */

// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const now = new Date();
  const date_now = dateToString(now);

  return await db.collection('ticket').where({
    date: _.lt(date_now),
    state: 'unused'
  }).update({
    data: {
      state: 'expired'
    },
  }).then(res => {
    console.log(res);
  }).catch((e) => {
    console.error(e);
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
