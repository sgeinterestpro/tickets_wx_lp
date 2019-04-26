import Taro from "@tarojs/taro";

const url_base = "http://127.0.0.1:10000";
// const url_base = "http://108.160.133.130:10000";

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

const getTickets = () => GET(`${url_base}/ticket`);
const applyNewTicket = (data) => POST(`${url_base}/ticket`, data);
const deleteTicket = (ticket_id) => DELETE(`${url_base}/ticket/${ticket_id}`);
const getHistoryTickets = () => GET(`${url_base}/ticket_history`);

export {getTickets, applyNewTicket, deleteTicket, getHistoryTickets}
