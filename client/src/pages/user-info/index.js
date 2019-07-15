/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、用户信息显示
 * 2、用户信息修改功能
 * 3、用户角色切换
 */
import Taro from "@tarojs/taro"
import {OpenData, Picker, View} from "@tarojs/components"
import {AtAvatar, AtList, AtListItem} from "taro-ui"
import "./index.scss"
import {roleAllList} from "../../config";
import TicketTabBar from "../../component/tab-bar"

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "个人中心",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      ticketNum: "",
      roleSelectIndex: "",
      roleList: {},
      userInfo: {}
    }
  }

  componentDidMount() {
    const {roleList} = this.state;
    const roleSelect = Taro.getStorageSync("Role") || "other";
    const userInfo = Taro.getStorageSync("UesrInfo") || {};
    const roleKeyList = userInfo.role;
    for (let roleKey of roleKeyList) {
      if (roleAllList[roleKey]) {
        roleList[roleKey] = roleAllList[roleKey]
      }
    }
    const roleKeyListNew = Object.keys(roleList);
    this.setState({
      roleSelectIndex: roleKeyListNew.indexOf(roleSelect)
    });
    this.setState({roleList, userInfo})
  }

  onRoleChange = e => {
    const roleSelectIndex = e.detail.value;
    const {roleList} = this.state;
    const roleKeyList = Object.keys(roleList);
    const roleKey = roleKeyList[e.detail.value];
    Taro.setStorageSync("Role", roleKey);
    this.setState({roleSelectIndex});
    Taro.reLaunch({url: "/pages/user-info/index"});
  };

  render() {
    const {roleSelectIndex, roleList, userInfo} = this.state;
    const roleValueList = Object.values(roleList);

    // noinspection JSXNamespaceValidation
    return (
      <View class="container">
        <View class="main">
          <View class="avatar">
            <AtAvatar openData={{type: "userAvatarUrl"}}/>
          </View>
          <View class="info">
            <OpenData type="userNickName"/>
          </View>
        </View>

        <View class="item-list">
          <View class="item">
            <AtList>
              <AtListItem title="姓名" extraText={userInfo["real_name"]}/>
              <AtListItem title="电话" extraText={userInfo["phone"]}/>
              <AtListItem title="工号" extraText={userInfo["work_no"]}/>
              <AtListItem title="邮箱" extraText={userInfo["email"]}/>
            </AtList>
          </View>
          {roleValueList.length > 1 &&
          <View class="item">
            <Picker mode="selector" range={roleValueList} value={roleSelectIndex}
                    onChange={this.onRoleChange.bind(this)}>
              <View class="picker">
                <View class="title">角色</View>
                <View class="text">{roleValueList[roleSelectIndex]}</View>
              </View>
            </Picker>
          </View>}
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
