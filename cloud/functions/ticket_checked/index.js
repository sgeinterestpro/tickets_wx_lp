/**
 * FunctionName: ticket_checked
 * Description: 标记某张券为已使用（检票操作）
 * Author: muumlover
 * Date: 2019-05-07
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

  return await db.collection('ticket').doc(event.ticket_id).get().then(res => {
    console.log(res);
    const ticket_doc = res.data;
    if (ticket_doc == null)
      return {'code': -1, 'message': '票券不存在'};
    if (ticket_doc['state'] !== 'unused')
      return {'code': -1, 'message': '票券状态异常'};
    const date_now = dateToString(now);
    if (ticket_doc['date'] !== date_now)
      return {'code': -1, 'message': '票券使用日期有误'};
    return db.collection('ticket').doc(event.ticket_id).update({
      data: {
        state: 'used',
        checker: userInfo.openId,
        check_time: now
      }
    }).then(res => {
      if (res.stats.updated === 0)
        return {code: -3, message: '检票出错', msg_ex: res.errMsg};
      return {code: 0, message: '票券检票成功', msg_ex: res.errMsg}
    })
  }).catch(e => {
    console.error(e);
    return {code: -1, message: '无效的票券', msg_ex: e.errMsg};
  })
};

const dateToString = (date) => {
  const year = date.getFullYear().toString();
  let month = (Number(date.getMonth()) + 1).toString();
  let day = (date.getDate()).toString();
  month = (month.length === 1) ? '0' + month : month;
  day = (day.length === 1) ? '0' + day : day;
  return year + "-" + month + "-" + day;
};
