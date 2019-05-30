import Taro from "@tarojs/taro";
import {CloudCall} from "../common/wxCloud";
import cloudRequest from "../common/cloudRequest";

const cloudFunction = false;
// const urlBase = "http://127.0.0.1:10000"; //本地调试
const urlBase = "http://45.62.125.195:10000"; //本地中转调试
// const urlBase = "http://108.160.133.130:10000";

const request = (method, url, data) => cloudRequest({
  url: url,
  data: data,
  header: {
    'content-type': 'application/json',
    'open-id': Taro.getStorageSync('OpenId') || ''
  },
  method: method,
  dataType: "json"
}).then(res => {
  console.debug(res.data);
  return res.data;
});

const GET = (url) => request("GET", url);
const POST = (url, data) => request("POST", url, data);
const DELETE = (url) => request("DELETE", url);
const PUT = (url, data) => request("PUT", url, data);

const ticketPackage = () => {
  console.log(`ticketPackage()`);
  if (cloudFunction) {
    return CloudCall('ticket_package')
  } else {
    return GET(`${urlBase}/ticket_package`);
  }
};
const purchaseTicket = (data) => {
  console.log(`purchaseTicket(${data})`);
  if (cloudFunction) {
    return CloudCall('ticket_purchase', data)
  } else {
    return POST(`${urlBase}/ticket_purchase`, data)
  }
};
const refundTicket = (ticket_id) => {
  console.log(`refundTicket(${ticket_id})`);
  if (cloudFunction) {
    return CloudCall('ticket_refund', {ticket_id: ticket_id});
  } else {
    return POST(`${urlBase}/ticket_refund`, {ticket_id: ticket_id});
  }
};
const inspectTicket = (ticket_id) => {
  console.log(`inspectTicket(${ticket_id})`);
  if (cloudFunction) {
    return CloudCall('ticket_inspect', {ticket_id: ticket_id});
  } else {
    return POST(`${urlBase}/ticket_inspect`, {ticket_id: ticket_id});
  }
};
const checkedTicket = (ticket_id) => {
  console.log(`checkedTicket(${ticket_id})`);
  if (cloudFunction) {
    return CloudCall('ticket_checked', {ticket_id: ticket_id});
  } else {
    return POST(`${urlBase}/ticket_checked`, {ticket_id: ticket_id});
  }
};
const ticketGenerate = (count) => {
  console.log(`ticketGenerate(${count})`);
  if (cloudFunction) {
    // return CloudCall('ticket_generate', {count: count});
  } else {
    return POST(`${urlBase}/ticket_generate`, {count: count});
  }
};
const ticketUsage = (count) => {
  console.log(`ticketUsage(${count})`);
  if (cloudFunction) {
    // return CloudCall('ticket_usage');
  } else {
    return POST(`${urlBase}/ticket_usage`);
  }
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
  getHistoryTickets
}
