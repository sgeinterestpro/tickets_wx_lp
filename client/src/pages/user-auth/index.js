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
        <AtButton
          type="primary"
          openType="getUserInfo"
          size="normal"
          onGetUserInfo={this.onGetUserInfo.bind(this)}
        >
          授权获取个人信息
        </AtButton>
      </View>
    )
  }
}
