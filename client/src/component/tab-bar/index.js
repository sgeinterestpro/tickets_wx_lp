/**
 * muumlover@2019-05-27
 * 底部导航栏模块
 * 1、根据用户角色动态切换导航栏
 * 2、导航栏链接跳转
 */

import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtTabBar} from "taro-ui";
import "./index.scss"
import getCurrentPageUrl from "../../common/getCurrentPageUrl"
import {roleTabUrls} from "../../config"

export default class Index extends Taro.Component {
  config = {};

  constructor() {
    super(...arguments);
    this.state = {
      current: -1,
      role: Taro.getStorageSync("Role") || "other"
    }
  }

  /**
   * 导航栏即将加载事件，更新图标激活显示
   */
  componentWillMount() {
    const {role} = this.state;
    const currentUrl = `/${getCurrentPageUrl()}`;
    console.debug("url now is: ", currentUrl);
    const tabList = roleTabUrls[role];
    tabList.forEach((element, current) => {
      if (currentUrl === element.url) {
        this.setState({current, role});
        console.debug("current set to: ", current);
      }
    });
  }

  /**
   * 处理导航栏点击事件
   * @param currentNext 目标导航页面
   */
  handleClick = currentNext => {
    const {current, role} = this.state;
    if (currentNext !== current) {
      const tabList = roleTabUrls[role];
      console.debug("url set to: ", tabList[currentNext].url);
      Taro.redirectTo({url: tabList[currentNext].url})
    }
  };

  render() {
    const {role, current} = this.state;
    // console.debug("current show is: ", current);
    // noinspection JSXNamespaceValidation
    return (
      <View>
        <AtTabBar
          backgroundColor="#ececec"
          color="#ea6bb8"
          tabList={roleTabUrls[role]}
          onClick={this.handleClick.bind(this)}
          current={current}
          fixed
        />
      </View>
    )
  }
}
