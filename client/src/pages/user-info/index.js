/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、用户信息显示
 * 2、用户信息修改功能
 * 3、用户角色切换
 */
import Taro from "@tarojs/taro"
import {Picker, View} from "@tarojs/components"
import {AtAvatar, AtButton, AtList, AtListItem} from "taro-ui"
import "./index.scss"
import {roleAllList, ticketClass} from "../../config";
import TicketTabBar from "../../component/tab-bar"
import {userUpdate} from "../../apis";

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
    const userInfo = Taro.getStorageSync("UserInfo") || {};
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

  onShareAppMessage = res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '票券助手',
      path: '/pages/index/index'
    }
  };

  onRoleChange = e => {
    const roleSelectIndex = e.detail.value;
    const {roleList} = this.state;
    const roleKeyList = Object.keys(roleList);
    const roleKey = roleKeyList[e.detail.value];
    Taro.setStorageSync("Role", roleKey);
    this.setState({roleSelectIndex});
    Taro.reLaunch({url: "/pages/user-info/index"}).then();
  };

  handleSyncUser = () => {
    Taro.navigateTo({url: "/pages/user-auth/index"}).then();
  };

  onGetUserInfo = (res) => {
    console.debug(res);
    // Taro.reLaunch({url: "/pages/index/index?jump=/pages/user-info/index"}).then()
    userUpdate(res.detail).then(() => Taro.reLaunch({url: "/pages/index/index?jump=/pages/user-info/index"}).then())
    // redirectTo({url: "/pages/index/index"})
  };

  render() {
    const {roleSelectIndex, roleList, userInfo} = this.state;
    // const roleValueList = Object.values(roleList);
    const roleValueList = Object.keys(roleList).map((key) => {
      return roleList[key];
    });
    let sportList = [];
    const {sports} = Taro.getStorageSync("UserInfo");
    if (!(sports && sports.length > 0)) {
      sportList = Object.keys(ticketClass)
    }
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        {userInfo["avatarUrl"] ? <View class="user-card">
          <View class="avatar">
            {/*<AtAvatar openData={{type: "userAvatarUrl"}}/>*/}
            <AtAvatar image={userInfo["avatarUrl"] || 'https://jdc.jd.com/img/200'}/>
          </View>
          <View class="info">
            {/*<OpenData type="userNickName"/>*/}
            <View>{userInfo["nickName"] || "同步微信信息失败"}</View>
          </View>
        </View> : <View class="user-card">
          <AtButton
            type="primary"
            openType="getUserInfo"
            size="normal"
            onGetUserInfo={this.onGetUserInfo.bind(this)}
          >
            授权获取用户信息
          </AtButton>
        </View>}
        {/*{userInfo["avatarUrl"] ? "" : <View class="button-full">*/}
        {/*  <AtButton*/}
        {/*    type="secondary"*/}
        {/*    circle*/}
        {/*    onClick={this.handleSyncUser.bind(this, userInfo['init_id'])}*/}
        {/*  >*/}
        {/*    同步用户信息*/}
        {/*  </AtButton>*/}
        {/*</View>}*/}
        <View class="block">
          <AtList hasBorder={false}>
            <AtListItem title="姓名" extraText={userInfo["real_name"]}/>
            <AtListItem title="电话" extraText={userInfo["phone"]}/>
            <AtListItem title="部门" extraText={userInfo["department"]}/>
            {/*<AtListItem class="item" title="工号" extraText={userInfo["work_no"]}/>*/}
            <AtListItem title="邮箱" extraText={userInfo["email"]}/>
            <AtListItem
              title="项目"
              extraText={(sportList).map((sport_item) => ticketClass[sport_item] || '未知').join()}/>
            {roleValueList.length > 1 &&
            <Picker mode="selector" range={roleValueList} value={roleSelectIndex}
                    onChange={this.onRoleChange.bind(this)}>
              <View class="cell">
                <View class="cell-title">角色</View>
                <View class="cell-extra">{roleValueList[roleSelectIndex]}</View>
              </View>
            </Picker>}
          </AtList>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
