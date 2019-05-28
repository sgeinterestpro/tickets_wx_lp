/**
 * FunctionName: ticket_refund
 * Description: 删除一张票券
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
  const dateNow = dateToString(now);

  return await db.collection('user').doc(userInfo.openId).update({
    data: {quota_used: _.inc(-1)}
  }).then(res => {
    if (res.stats.updated === 0)
      return {'code': -1, 'message': '删除申请失败了'};
    else
      return db.collection('ticket').doc(event.ticket_id).get().then(res => {
        const ticket = res.data;
        if (ticket == null)
          return {'code': -1, 'message': '票券不存在'};
        if (ticket.state !== 'unused')
          return {'code': -1, 'message': '禁止删除此状态的票券'};
        if (ticket.date < dateNow)
          return {'code': -1, 'message': '禁止删除过期票券'};
        return db.collection('ticket').doc(event.ticket_id).remove().then(res => {
          if (res.stats.removed === 0)
            return {code: -1, message: '找不到待删除数据', msg_ex: res.errMsg};
          return {code: 0, message: '删除成功', msg_ex: res.errMsg}
        }).catch((e) => {
          console.error(e);
          return {code: -3, message: '票券删除出错', msg_ex: e.errMsg};
        })
      }).catch(e => {
        console.error(e);
        return {code: -1, message: '无效的票券', msg_ex: e.errMsg};
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
