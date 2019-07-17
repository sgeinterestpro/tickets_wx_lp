import Taro from "@tarojs/taro";
import {cloudRequest} from "../common/cloudRequest";

// const urlBase = "http://127.0.0.1:10000"; //本地调试
const urlBase = "http://ticket.sge-tech.com:10000";

const request = (method, url, data) => {
  let _request = cloudRequest;
  if (url.indexOf("127.0.0.1") !== -1) _request = Taro.request;
  return new Promise((resolve, reject) => {
    _request({
      url: url,
      data: data,
      header: {
        "content-type": "application/json",
        "open-id": Taro.getStorageSync("OpenId") || ""
      },
      method: method,
      dataType: "json"
    }).then(res => {
      if (res.statusCode >= 400) {
        console.error(res);
        reject(res.data);
      } else {
        console.debug(res);
        resolve(res.data);
      }
    }).catch(err => {
      console.error(err);
      reject(err)
    });
  });
};

const GET = (url) => request("GET", url);
const POST = (url, data) => request("POST", url, data);
// const DELETE = (url) => request("DELETE", url);
// const PUT = (url, data) => request("PUT", url, data);

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
  return POST(`${urlBase}/ticket_refund`, {ticket_id});
};
const inspectTicket = (ticket_id) => {
  console.log(`API: inspectTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_inspect`, {ticket_id});
};
const checkedTicket = (ticket_id) => {
  console.log(`API: checkedTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_checked`, {ticket_id});
};
const ticketGenerate = (count) => {
  console.log(`API: ticketGenerate(${count})`);
  return POST(`${urlBase}/ticket_generate`, {count});
};
const ticketUsage = () => {
  console.log(`API: ticketUsage()`);
  return POST(`${urlBase}/ticket_usage`);
};
const ticketLog = (skip, limit) => {
  console.log(`API: ticketLog(${skip}, ${limit})`);
  return POST(`${urlBase}/ticket_log`, {skip, limit});
};
const ticketCheckLog = (start, end) => {
  console.log(`API: ticketCheckLog(${start}, ${end})`);
  return POST(`${urlBase}/ticket_check_log`, {start, end});
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
const userAdd = (data) => {
  console.log(`API: userAdd(${data})`);
  return POST(`${urlBase}/member_add`, data);
};
const userDelete = (init_id) => {
  console.log(`API: userDelete(${init_id})`);
  return POST(`${urlBase}/member_delete`, {init_id});
};
const userFind = (init_id) => {
  console.log(`API: userFind(${init_id})`);
  return POST(`${urlBase}/member_find`, {init_id});
};
const userList = () => {
  console.log(`API: userList()`);
  return POST(`${urlBase}/member_list`);
};
// const getHistoryTickets = () => GET(`${urlBase}/ticket_history`);

export {
  checkedTicket,
  inspectTicket,
  purchaseTicket,
  refundTicket,
  ticketPackage,
  ticketCheckLog,
  ticketGenerate,
  ticketLog,
  ticketUsage,
  userAdd,
  userBind,
  userDelete,
  userFind,
  userInfo,
  userList,
  userUpdate,
  // getHistoryTickets
}
