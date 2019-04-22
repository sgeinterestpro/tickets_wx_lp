import Taro from "@tarojs/taro";

const url_base = "127.0.0.1:8080";

const request = (method, url, data) => Taro.request({
  url: url,
  data: data,
  header: {
    'content-type': 'application/json'
  },
  method: method,
  dataType: "json"
}).then(res => console.log(res.data));

const GET = (url) => request("GET", url);
const POST = (url, data) => request("POST", url, data);

const getTicketList = () => GET(`${url_base}/ticket`);
const applyNewTicket = (data) => POST(`${url_base}/ticket_apply`, data);
