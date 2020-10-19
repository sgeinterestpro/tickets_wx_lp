import Taro from "@tarojs/taro";
import { defaultErrorUrl } from "../config";

const urlBase = "https://ticket.sge.ronpy.com"; //正式环境

const request = (method, url, data, dataType = "json") => {
  Taro.showNavigationBarLoading();
  // let _request = cloudRequest;
  // if (url.indexOf("localhost") !== -1) _request = Taro.request;
  let _request = Taro.request;
  return new Promise((resolve, reject) => {
    _request({
      url: url,
      data: data,
      header: {
        "content-type": "application/json",
        "open-id": Taro.getStorageSync("OpenId") || ""
      },
      method: method,
      dataType: dataType
    }).then(res => {
      Taro.hideNavigationBarLoading();
      if (res.statusCode >= 500) {
        console.error(res);
        reject(res.data);
      } else if (res.statusCode >= 400) {
        console.error(res.data);
        Taro.setStorage({ key: "ErrorInfo", data: res.data }).then();
        Taro.redirectTo({ url: defaultErrorUrl }).then()
      } else {
        console.debug(res);
        resolve(res.data);
      }
    }).catch(err => {
      Taro.hideNavigationBarLoading();
      console.error(err);
      reject(err)
    });
  });
};

const GET = (url, dataType) => request("GET", url, undefined, dataType);
const POST = (url, data, dataType) => request("POST", url, data, dataType);
// const DELETE = (url) => request("DELETE", url);
// const PUT = (url, data) => request("PUT", url, data);

const wxLogin = (js_code) => {
  console.log(`API: wxLogin(${js_code})`);
  return POST(`${urlBase}/auth/weixin/login`, { js_code: js_code });
};
const ticketPackage = () => {
  console.log(`API: ticketPackage()`);
  return GET(`${urlBase}/ticket_package`);
};
const purchaseTicket = (data) => {
  console.log(`API: purchaseTicket(${JSON.stringify(data)})`);
  return POST(`${urlBase}/ticket_purchase`, data)
};
const refundTicket = (ticket_id) => {
  console.log(`API: refundTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_refund`, { ticket_id });
};
const inspectTicket = (ticket_id) => {
  console.log(`API: inspectTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_inspect`, { ticket_id });
};
const checkedTicket = (ticket_id) => {
  console.log(`API: checkedTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_checked`, { ticket_id });
};
const messageList = () => {
  console.log(`API: messageList()`);
  return POST(`${urlBase}/message_list`)
};
const messageCount = () => {
  console.log(`API: messageCount()`);
  return POST(`${urlBase}/message_count`)
};
const messageAction = (message_id) => {
  console.log(`API: messageAction(${message_id})`);
  return POST(`${urlBase}/message_action`, { message_id })
};
const ticketSignIn = (data) => {
  console.log(`API: ticketSignIn(${JSON.stringify(data)})`);
  return POST(`${urlBase}/ticket_sign_in`, data)
};
const ticketGenerate = (count) => {
  console.log(`API: ticketGenerate(${count})`);
  return POST(`${urlBase}/ticket_generate`, { count });
};
const ticketUsage = () => {
  console.log(`API: ticketUsage()`);
  return POST(`${urlBase}/ticket_usage`);
};
const ticketLog = (skip, limit) => {
  console.log(`API: ticketLog(${skip}, ${limit})`);
  return POST(`${urlBase}/ticket_log`, { skip, limit });
};
const ticketCheckLog = (start, end) => {
  console.log(`API: ticketCheckLog(${start}, ${end})`);
  return POST(`${urlBase}/ticket_check_log`, { start, end });
};
const ticketCheckCount = (start, end) => {
  console.log(`API: ticketCheckCount(${start}, ${end})`);
  return POST(`${urlBase}/ticket_check_count`, { start, end });
};
const userBind = (data) => {
  console.log(`API: userBind(${JSON.stringify(data)})`);
  return POST(`${urlBase}/user_bind`, data);
};
const userInfo = () => {
  console.log(`API: userInfo()`);
  return POST(`${urlBase}/user_info`);
};
const userUpdate = (data) => {
  console.log(`API: userUpdate(${JSON.stringify(data)})`);
  return POST(`${urlBase}/user_update`, data);
};
const memberAdd = (data) => {
  console.log(`API: userAdd(${data})`);
  return POST(`${urlBase}/member_add`, data);
};
const memberEdit = (data) => {
  console.log(`API: memberEdit(${data})`);
  return POST(`${urlBase}/member_edit`, data);
};
const memberDelete = (init_id) => {
  console.log(`API: userDelete(${init_id})`);
  return POST(`${urlBase}/member_delete`, { init_id });
};
const memberFind = (init_id) => {
  console.log(`API: userFind(${init_id})`);
  return POST(`${urlBase}/member_find`, { init_id });
};
const memberList = () => {
  console.log(`API: userList()`);
  return POST(`${urlBase}/member_list`);
};
const reportExport = (type, params) => {
  console.log(`API: reportExport(${type},${params})`);
  return POST(`${urlBase}/report_export`, { type, params });
};
const reportList = () => {
  console.log(`API: reportList()`);
  return GET(`${urlBase}/report_list`);
};
const rsaPubKey = () => {
  console.log(`API: rsa_pub_key()`);
  return GET(`${urlBase}/web/rsa_pub_key`, 'data');
};
// const getHistoryTickets = () => GET(`${urlBase}/ticket_history`);

export {
  wxLogin,
  checkedTicket,
  inspectTicket,
  memberAdd,
  memberEdit,
  memberDelete,
  memberFind,
  memberList,
  messageList,
  messageCount,
  messageAction,
  purchaseTicket,
  refundTicket,
  reportExport,
  reportList,
  rsaPubKey,
  ticketSignIn,
  ticketPackage,
  ticketCheckLog,
  ticketCheckCount,
  ticketGenerate,
  ticketLog,
  ticketUsage,
  userBind,
  userInfo,
  userUpdate,
  // getHistoryTickets
}
