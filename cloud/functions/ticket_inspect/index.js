/**
 * FunctionName: ticket_inspect
 * Description: 查看票券详细信息（用券时供检票人员核对）
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
  const now = new Date();
  const userInfo = event.userInfo;
  return await db.collection('ticket').doc(event.ticket_id).get().then(res => {
    console.log(res);
    console.log(res);
    const ticket_doc = res.data;
    if (ticket_doc == null)
      return {'code': -1, 'message': '票券不存在'};
    if (ticket_doc['state'] === 'used')
      return {'code': -1, 'message': '票券已被使用'};
    if (ticket_doc['state'] === 'expired')
      return {'code': -1, 'message': '票券已过期'};
    if (ticket_doc['state'] !== 'unused')
      return {'code': -1, 'message': '票券状态异常'};
    const date_now = dateToString(now);
    if (ticket_doc['date'] < date_now)
      return {'code': -1, 'message': '票券已过期'};
    if (ticket_doc['date'] > date_now)
      return {'code': -1, 'message': '票券未生效'};
    return {
      'code': 0,
      'ticket': res.data,
      'user': {'openid': userInfo.openId},
      'message': '票券状态核验通过',
      'msg_ex': res.errMsg
    };
  }).catch(e => {
    console.error(e);
    return {'code': -1, 'message': '无效的票券', 'msg_ex': e.errMsg}
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
