/**
 * FunctionName: ticket_purchase
 * Description: 申请新的票券
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
  const now = new Date();
  const this_weeks = [0, 1, 2, 3, 4, 5, 6].map(item => getWeekDay(item));
  const date_now = dateToString(now);

  let data = {
    class: event.class,
    title: event.title,
    date: event.date,
    state: 'unused',
    purchaser: userInfo.openId,
    purch_time: now
  };

  return await db.collection('user').doc(userInfo.openId).get().then(res => {
    const user = res.data;
    if (user.quota_used >= user.weekly_limit)
      return {'code': -1, 'message': '已超过本周领取限额'};
    return db.collection('user').where({
      _id: userInfo.openId,
      quota_used: user.quota_used
    }).update({
      data: {quota_used: _.inc(1)}
    }).then(res => {
      console.log('inc_res.stats.updated', res.stats.updated);
      if (res.stats.updated === 0) {
        return {'code': -1, 'message': '请求频率快追上火箭了'};
      } else {
        return db.collection('ticket').where({
          purchaser: userInfo.openId,
          date: _.in(this_weeks)
        }).count().then(res => {
          if (res.total >= 3)
            return {'code': -1, 'message': '无法领取更多票券'};
          else if (!('date' in data))
            return {'code': -2, 'message': '请求参数出错'};
          else if (!(date_now <= data.date && data.date <= this_weeks[6]))
            return {'code': -1, 'message': '所选日期无法领取'};

          try {
            return db.collection('ticket').add({
              data
            }).then(res => {
              data.id = res._id;
              return {code: 0, data: data, message: '领取成功', msg_ex: res.errMsg}
            })
          } catch (e) {
            console.error(e);
            return {code: -3, message: '生成票券出错', msg_ex: e.errMsg}
          }
        }).catch((e) => {
          console.error(e);
          return {code: -3, message: '统计个人票券出错', msg_ex: e.errMsg};
        });
      }
    });
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
