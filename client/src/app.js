import Taro from "@tarojs/taro"
import Index from "./pages/index"

import "./app.scss"
import { login } from "./common/getUserInfo";
import { rsaPubKey } from "./apis";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== "production" && process.env.TARO_ENV === "h5")  {
//   require("nerv-devtools")
// }

class App extends Taro.Component {
  config = {
    pages: [
      "pages/index/index",
      "pages/error/index",
      "pages/message-list/index",
      "pages/scan-history/index",
      "pages/ticket-gather/index",
      "pages/ticket-history/index",
      "pages/ticket-manage/index",
      "pages/ticket-package/index",
      "pages/ticket-scan/index",
      "pages/ticket-show/index",
      "pages/ticket-sign-in/index",
      "pages/user-add/index",
      "pages/user-auth/index",
      "pages/user-bind/index",
      "pages/user-edit/index",
      "pages/user-info/index",
      "pages/user-manage/index",
    ],
    window: {
      backgroundColor: "#356284",
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#1A5784",
      navigationBarTitleText: "票券助手",
      navigationBarTextStyle: "white",
    },
    networkTimeout: {
      request: 20000
    }
  };

  componentDidShow() {
    if (!Taro.getStorageSync("OpenId"))
      this.getOpenId();
    if (!Taro.getStorageSync("PubKey")) {
      rsaPubKey().then(res => {
        console.log(res);
        Taro.setStorage({ key: "PubKey", data: res }).then();
      });
    }
  }

  getOpenId = () => {
    console.log('getOpenId()');
    login().then(() => {
      Taro.eventCenter.trigger("OpenID");
    }).catch(err => {
      console.error(err);
    })
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    // noinspection JSXNamespaceValidation
    return (<Index />)
  }
}

Taro.render(<App />, document.getElementById("app"));
