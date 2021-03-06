/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、TODO 查看所有用户
 * 2、TODO 新增用户、删除用户
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtCard, AtListItem, AtSearchBar} from "taro-ui";
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
      noneText: "正在加载用户信息……",
      searchText: '',
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
    }
    memberList().then(res => {
      const userList = res.items;
      Taro.setStorage({key: 'user-manage-userList', data: userList}).then();
      this.setState({userList: userList, noneText: "暂时没有员工数据"});
    }).catch(err => {
      console.error(err);
      this.setState({noneText: "员工数据加载失败"});
      Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
    });
  };

  onSearchChange = (value) => {
    this.setState({searchText: value})
  };

  handleUserClick = (init_id) => Taro.navigateTo({url: `/pages/user-edit/index?id=${init_id}`});
  handleAddUser = () => Taro.navigateTo({url: `/pages/user-add/index`});

  render() {
    const {userList, noneText, searchText} = this.state;
    const userListResult = (() => {
      const searchRegex = new RegExp(searchText, 'g');
      if (userList) {
        return userList.filter((user) => {
          return (
            searchRegex.test(user["real_name"]) ||
            searchRegex.test(user["email"])
            // 返回real_name或者email字段满足筛选条件的数据
          );
        });
      }
    })();
    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="bg">
          <View class="block block-search">
            <AtSearchBar value={searchText} onChange={this.onSearchChange.bind(this)}/>
          </View>
          <View class="button-full">
            <AtButton type="secondary" circle onClick={this.handleAddUser.bind(this)}>
              新增用户
            </AtButton>
          </View>
          <View class="block">
            <View class="list">
              {userListResult.length > 0 ?
                userListResult.map((user, index) => (
                  <View class="list-item card-fix" key={index}>
                    <AtCard
                      isFull={true}
                      note={user["email"]}
                      extra={user["user_id"] ? "" : "未绑定微信"}
                      title={`姓名：${user["real_name"]}`}
                      onClick={this.handleUserClick.bind(this, user["init_id"])}
                      thumb={user["avatarUrl"] || 'https://jdc.jd.com/img/13'}
                    >
                      <View>
                        项目：{user["sports"].map((sport) => ticketClass[sport] || '未知').join() || '未加入任何项目'}
                      </View>
                    </AtCard>
                  </View>
                )) :
                <AtListItem className="list-item" title={noneText}/>
              }
            </View>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
