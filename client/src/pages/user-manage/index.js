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
import {userList} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "用户列表",
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments);
    this.state = {
      user_list: [],
      none_text: "正在加载用户信息……"
    }
  }

  componentDidShow() {
    Taro.startPullDownRefresh();
  }

  onPullDownRefresh() {
    this.updateUserList();
  }

  /**
   * 更新用户列表显示
   */
  updateUserList = () => {
    userList().then(res => {
      const user_list = res.items;
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载成功", icon: "none", duration: 500});
      this.setState({user_list, none_text: "暂时没有员工数据"});
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载失败", icon: "none", duration: 500});
      this.setState({none_text: "员工数据加载失败"});
    });
  };

  handleUserClick = (init_id) => Taro.navigateTo({url: `/pages/user-edit/index?id=${init_id}`});
  handleAddUser = () => Taro.navigateTo({url: `/pages/user-add/index`});

  render() {
    const {user_list, none_text} = this.state;

    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="container">
          <View class="add">
            <AtButton
              type="secondary"
              circle
              onClick={this.handleAddUser.bind(this)}
            >
              新增用户
            </AtButton>
          </View>
          <View class="list">
            {user_list.length > 0 ?
              user_list.map((user_item, index) => (
                <AtCard
                  key={index}
                  className={"item"}
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
              )) :
              <AtListItem className="item" title={none_text}/>
            }
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
