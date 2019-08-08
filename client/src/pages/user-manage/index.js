/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、TODO 查看所有用户
 * 2、TODO 新增用户、删除用户
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtCard, AtListItem} from "taro-ui";
import "./index.scss"
import {ticketClass} from "../../config";
import TicketTabBar from "../../component/tab-bar"
import {memberList} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "用户列表",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      userList: Taro.getStorageSync('user-manage-userList') || [],
      noneText: "正在加载用户信息……"
    }
  }

  /**
   * 页面显示事件，触发更新数据
   */
  componentDidShow() {
    this.updateUserList();
  }

  /**
   * 更新用户列表显示
   */
  updateUserList = () => {
    if (this.first === undefined) {
      this.first = true;
      Taro.showLoading({title: '加载中'}).then();
    }
    memberList().then(res => {
      Taro.hideLoading();
      const userList = res.items;
      Taro.setStorage({key: 'user-manage-userList', data: userList}).then();
      this.setState({userList: userList, noneText: "暂时没有员工数据"});
    }).catch(err => {
      console.error(err);
      this.setState({noneText: "员工数据加载失败"});
      Taro.hideLoading();
      Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
    });
  };

  handleUserClick = (init_id) => Taro.navigateTo({url: `/pages/user-edit/index?id=${init_id}`});
  handleAddUser = () => Taro.navigateTo({url: `/pages/user-add/index`});

  render() {
    const {userList, noneText} = this.state;

    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="bg">
          <View class="add">
            <AtButton
              type="secondary"
              circle
              onClick={this.handleAddUser.bind(this)}
            >
              新增用户
            </AtButton>
          </View>
          <View class="block">
            <View class="list list-card">
              {userList.length > 0 ?
                userList.map((user_item, index) => (
                  <View class="item item-card">
                    <AtCard
                      key={index}
                      isFull={true}
                      note={user_item["email"]}
                      extra={`工号：${user_item["work_no"]}`}
                      title={`姓名：${user_item["real_name"]}`}
                      onClick={this.handleUserClick.bind(this, user_item["init_id"])}
                      thumb={user_item["avatarUrl"] || 'https://jdc.jd.com/img/13'}
                    >
                      {user_item["user_id"] ? "" : <View>提示：用户未绑定微信</View>}
                      <View>项目：{user_item["sports"].map((sport_item) => ticketClass[sport_item] || '未知')}</View>
                    </AtCard>
                  </View>
                )) :
                <AtListItem className="item" title={noneText}/>
              }
            </View>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
