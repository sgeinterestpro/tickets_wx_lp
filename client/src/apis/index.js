import Taro from "@tarojs/taro";
import {CloudCall} from "../common/wxCloud";

// const url_base = "http://127.0.0.1:10000";
const url_base = "http://108.160.133.130:10000";

const request = (method, url, data) => Taro.request({
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

const getTicketList = () => {
  // return GET(`${url_base}/ticket`);
  return CloudCall('ticket_package')
};
const applyNewTicket = (data) => {
  // return POST(`${url_base}/ticket`, data)
  return CloudCall('ticket_purchase', data)
};
const deleteTicket = (ticket_id) => {
  // return DELETE(`${url_base}/ticket/${ticket_id}`);
  return CloudCall('ticket_refund', {ticket_id: ticket_id});
};
const getTicketInfo = (ticket_id) => {
  // return GET(`${url_base}/ticket/${ticket_id}`);
  console.log(ticket_id);
  return CloudCall('ticket_inspect', {ticket_id: ticket_id});
};
const useTicket = (ticket_id, data) => {
  // return PUT(`${url_base}/ticket/${ticket_id}`, data);
  console.log(ticket_id);
  return CloudCall('ticket_checked', {ticket_id: ticket_id});
};
const getHistoryTickets = () => GET(`${url_base}/ticket_history`);

export {getTicketList, applyNewTicket, deleteTicket, getTicketInfo, useTicket, getHistoryTickets}
