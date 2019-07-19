/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、用户信息显示
 * 2、用户信息修改功能
 * 3、用户角色切换
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtAvatar, AtButton} from "taro-ui"
import "./index.scss"
import {roleAllList, ticketClass} from "../../config";
import {memberDelete, memberFind} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "用户信息",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      roleList: {},
      userInfo: {}
    }
  }

  componentDidMount() {
    const {id} = this.$router.params;
    const {roleList} = this.state;
    memberFind(id).then((res) => {
      if (res.code !== 0) {
      } else {
        const userInfo = res.data || {};
        const roleKeyList = userInfo.role;
        for (let roleKey of roleKeyList) {
          if (roleAllList[roleKey]) {
            roleList[roleKey] = roleAllList[roleKey]
          }
        }
        this.setState({roleList, userInfo})
      }
    })
  }

  handleDeleteUser = (id) => {
    Taro.showModal({
      title: "删除该用户？",
      content: "用户删除后该用户将无法登录并使用本系统，点击删除后将无法撤销删除操作，请确认是否继续删除？",
      confirmText: "取消",
      confirmColor: "#000000",
      cancelText: "删除",
      cancelColor: "#FF0000"
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        memberDelete(id).then(res => {
          if (res.code !== 0) {
            this.setState({
              tOpened: false,
              tText: "删除失败",
              tStatus: "error",
            });
            Taro.showModal({content: res.message, showCancel: false});
          } else {
            this.setState({
              tOpened: true,
              tText: "删除成功",
              tStatus: "success",
            });
            Taro.navigateBack();
          }
        });
        this.setState({
          openIndex: -1,
          tOpened: true,
          tText: "删除中...",
          tStatus: "loading",
        });
      }
    });
  };

  render() {
    const {userInfo} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="container">
        <View class="main">
          <View class="avatar">
            <AtAvatar image={userInfo["avatarUrl"] || 'https://jdc.jd.com/img/200'}/>
            {/*<AtAvatar openData={{type: "userAvatarUrl"}}/>*/}
          </View>
          <View class="info">
            <View>{userInfo["nickName"] || "同步用户微信信息失败"}</View>
            {/*<OpenData type="userNickName"/>*/}
          </View>
        </View>

        <View class="list">
          <View class="item">姓名：{userInfo["real_name"]}</View>
          <View class="item">电话：{userInfo["phone"]}</View>
          <View class="item">工号：{userInfo["work_no"]}</View>
          <View class="item">邮箱：{userInfo["email"]}</View>
          <View class="item">
            角色：{(userInfo["role"] || []).map((role) => roleAllList[role] || '未知').join(',')}
          </View>
          <View class="item">
            项目：{(userInfo["sports"] || []).map((sport) => ticketClass[sport] || '未知').join(',')}
          </View>
        </View>
        <View class="delete">
          <AtButton
            className={'delete-button'}
            type="secondary"
            circle
            onClick={this.handleDeleteUser.bind(this, userInfo['init_id'])}
          >
            删除用户
          </AtButton>
        </View>
      </View>
    )
  }
}
