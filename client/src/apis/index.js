import Taro from "@tarojs/taro";
import {cloudRequest} from "../common/cloudRequest";

const urlBase = "http://127.0.0.1:10000"; //本地调试
// const urlBase = "http://ticket.sge-tech.com:10000";

const request = (method, url, data) => {
  let _request = cloudRequest;
  if (url.indexOf('127.0.0.1') !== -1) _request = Taro.request;
  return new Promise((resolve, reject) => {
    _request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json',
        'open-id': Taro.getStorageSync('OpenId') || ''
      },
      method: method,
      dataType: "json"
    }).then(res => {
      if (res.statusCode >= 400) {
        console.error(res);
        reject(res.data);
      } else {
        resolve(res.data);
      }
    }).catch(e => {
      console.error(e);
      reject(e)
    });
  });
};

const GET = (url) => request("GET", url);
const POST = (url, data) => request("POST", url, data);
const DELETE = (url) => request("DELETE", url);
const PUT = (url, data) => request("PUT", url, data);

const ticketPackage = () => {
  console.log(`ticketPackage()`);
  return GET(`${urlBase}/ticket_package`);
};
const purchaseTicket = (data) => {
  console.log(`purchaseTicket(${data})`);
  return POST(`${urlBase}/ticket_purchase`, data)
};
const refundTicket = (ticket_id) => {
  console.log(`refundTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_refund`, {ticket_id: ticket_id});
};
const inspectTicket = (ticket_id) => {
  console.log(`inspectTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_inspect`, {ticket_id: ticket_id});
};
const checkedTicket = (ticket_id) => {
  console.log(`checkedTicket(${ticket_id})`);
  return POST(`${urlBase}/ticket_checked`, {ticket_id: ticket_id});
};
const ticketGenerate = (count) => {
  console.log(`ticketGenerate(${count})`);
  return POST(`${urlBase}/ticket_generate`, {count: count});
};
const ticketUsage = () => {
  console.log(`ticketUsage()`);
  return POST(`${urlBase}/ticket_usage`);
};
const ticketLog = () => {
  console.log(`ticketUsage()`);
  return POST(`${urlBase}/ticket_log`);
};
const userBind = (data) => {
  console.log(`userBind(${data})`);
  return POST(`${urlBase}/user_bind`, data);
};
const userInfoUpdate = (data) => {
  console.log(`userInfoUpdate(${data})`);
  return POST(`${urlBase}/user_info`, data);
};
const userInfoRequest = () => {
  console.log(`userInfoRequest()`);
  return GET(`${urlBase}/user_info`);
};
const getHistoryTickets = () => GET(`${urlBase}/ticket_history`);

export {
  ticketPackage,
  purchaseTicket,
  refundTicket,
  inspectTicket,
  checkedTicket,
  ticketGenerate,
  ticketUsage,
  ticketLog,
  userBind,
  userInfoUpdate,
  userInfoRequest,
  getHistoryTickets
}
