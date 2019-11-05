/**
 * muumlover@2019-05-27
 * 用户授权页面
 * 1、用户授权按钮
 * 2、TODO 用户信息获取
 */
import Taro, {redirectTo} from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton} from "taro-ui"
import "./index.scss"
import {userUpdate} from "../../apis";

export default class Index extends Taro.Component {

  config = {
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTextStyle: "black",
    navigationBarTitleText: "授权页面",
  };

  constructor() {
    super(...arguments);
    this.state = {}
  }

  onGetUserInfo = (res) => {
    console.debug(res);
    userUpdate(res.detail);
    redirectTo({url: "/pages/index/index"})
  };

  render() {
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg bg-center">
        <View class="block center">
          该小程序仅限上海黄金交易所内部员工使用，登陆过程需要通过内部邮箱绑定验证后方可使用。
        </View>
        <AtButton
          type="primary"
          openType="getUserInfo"
          size="normal"
          onGetUserInfo={this.onGetUserInfo.bind(this)}
        >
          去绑定邮箱
        </AtButton>
      </View>
    )
  }
}
