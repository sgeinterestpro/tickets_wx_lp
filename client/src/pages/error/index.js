/**
 * muumlover@2019-05-27
 * 用户授权页面
 * 1、用户授权按钮
 * 2、TODO 用户信息获取
 */
import Taro, { redirectTo } from "@tarojs/taro"
import { View } from "@tarojs/components"
import "./index.scss"

export default class Index extends Taro.Component {

  config = {
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTextStyle: "black",
    navigationBarTitleText: "访问错误",
  };

  constructor() {
    super(...arguments);
    this.state = {
      errorInfo: Taro.getStorageSync("ErrorInfo") || "系统错误"
    }
  }

  render() {
    const { errorInfo } = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg bg-center">
        <View class="block center">
          {errorInfo}
        </View>
      </View>
    )
  }
}
