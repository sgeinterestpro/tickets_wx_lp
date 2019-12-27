/**
 * muumlover@2019-05-27
 * 小程序默认页面
 * 1、检验用户是否授权小程序获取信息
 * 2、根据用户角色进行默认页面的跳转
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import "./index.scss"
import {defaultBindUrl, defaultRoleUrl, roleTabUrls} from "../../config";
import {userInfo} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTextStyle: "black",
    navigationBarTitleText: "票券助手",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      info: "",
      needReLaunch: false,
    }
  }

  componentDidShow() {
    if (this.state.needReLaunch) {
      Taro.reLaunch({url: "/pages/index/index"}).then()
    }
    Taro.eventCenter.on('OpenID', () => {
      Taro.reLaunch({url: "/pages/index/index"}).then()
    })
  }

  componentDidHide() {
    this.setState({needReLaunch: true});
  }

  componentWillMount() {
    let role = Taro.getStorageSync("Role") || "user";
    // 获取用户状态，根据用户状态决定
    // 未授权用户 授权才能拿到 openid，才能确定是谁的微信
    // 未绑定用户 绑定了才能对应到具体人员，拿到具体人员信息
    // 已绑定用户
    userInfo().then(res => {
      // console.debug(res);
      // 请求用户数据成功
      Taro.setStorageSync("UserInfoRetry", 0);
      // 根据 res.data.email 是否有值判断用户是否已经绑定
      if (res.data && res.data.email) {
        // 用户已经绑定身份
        Taro.setStorageSync("UserInfo", res.data);
        const roles = res.data.role;
        const {jump} = this.$router.params;
        if (!roles.includes(role)) {
          role = roles[0] || "other";
        }
        // console.debug('jump', jump);
        // console.debug('role', role);
        // console.debug('roleTabUrls[\'role\']', roleTabUrls[role]);
        // console.debug('roleTabUrls[role].includes(jump)', roleTabUrls[role].includes(jump));
        for (let x of roleTabUrls[role]) {
          // console.debug('x', x);
          if (x.url === jump) {
            Taro.redirectTo({url: jump}).then()
          }
        }
        Taro.setStorageSync("Role", role);
        Taro.redirectTo({url: defaultRoleUrl[role]}).then()
      } else {
        // 需要绑定用户身份
        Taro.redirectTo({url: defaultBindUrl}).then()
      }
    }).catch(err => {
      console.error(err);
      // 服务器连接失败——重试5次，每次间隔2秒
      const retry = Taro.getStorageSync("UserInfoRetry");
      if (retry === 0) {
        Taro.setStorageSync("UserInfoRetry", retry + 1);
        setTimeout(() => {
          Taro.reLaunch({url: "/pages/index/index"}).then()
        }, 1000)
      } else if (retry < 5) {
        this.setState({info: "用户认证失败，两秒后重试..."});
        Taro.setStorageSync("UserInfoRetry", retry + 1);
        setTimeout(() => {
          Taro.reLaunch({url: "/pages/index/index"}).then()
        }, 2000)
      } else {
        this.setState({info: "用户认证失败，服务器暂时被结界封印了..."});
        Taro.setStorageSync("UserInfoRetry", 0);
      }
    });
  }

  render() {
    const info = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg bg-center"> {info} </View>
    )
  }
}
