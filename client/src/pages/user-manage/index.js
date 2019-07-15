/**
 * muumlover@2019-05-27
 * 用户信息页面
 * 1、TODO 查看所有用户
 * 2、TODO 新增用户、删除用户
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtCard, AtListItem, AtToast} from "taro-ui";
import "./index.scss"
import TicketTabBar from "../../component/tab-bar"
import ModalTicketPurchase from "../../component/modal-ticket-purchase"
import {refundTicket, userList} from "../../apis";

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
      toast_loading: false,
      toast_text: "加载中...",
      toast_status: "loading",
      modal_ticket_purchase_show: false,
      open_index: -1,
      user_list: []
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
      console.log(res);
      let {user_list} = this.state;
      user_list = res.items;
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载成功", icon: "none", duration: 500});
      this.setState({user_list, open_index: -1, toast_loading: false});
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载失败", icon: "none", duration: 500});
    });
  };

  /**
   * 券点击事件，跳转到票券详情
   * @param item 票券参数
   */
  onTicketClick = (item) => {
    this.setState({open_index: -1});
    Taro.navigateTo({
      url: `/pages/ticket-show/index?id=${item._id}`
    })
  };

  /**
   * 滑动功能区打开
   * 限制只能打开一个滑动功能区
   * @param index
   */
  onSwipeActionOpened = (index) => {
    console.log("onSwipeActionOpened", index);
    this.setState({open_index: index})
  };

  /**
   * 滑动功能区点击
   * 删除票券
   * @param index
   */
  onSwipeActionClick = (index) => {
    //todo 增加删除确认
    const {user_list} = this.state;
    const ticket = user_list[index];
    Taro.showModal({
      title: "删除确认",
      content: "是否删除该票券？",
      confirmText: "取消",
      confirmColor: "#000000",
      cancelText: "删除",
      cancelColor: "#FF0000"
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        console.log(ticket._id);
        refundTicket(ticket._id).then(res => {
          this.updateUserList();
          if (res.code !== 0) {
            this.setState({
              toast_loading: false,
              toast_text: "删除失败",
              toast_status: "error",
            });
            Taro.showModal({content: res.message, showCancel: false});
          } else {
            this.setState({
              toast_loading: true,
              toast_text: "删除成功",
              toast_status: "success",
            });
          }
        });
        this.setState({
          open_index: -1,
          toast_loading: true,
          toast_text: "删除中...",
          toast_status: "loading",
        });
      }
    });
  };

  /**
   * 领取新票券按钮点击
   */
  modalTicketPurchaseShow = () => {
    this.setState({open_index: -1, modal_ticket_purchase_show: true});
  };

  /**
   * 领券中心弹窗返回
   * @constructor
   */
  modalTicketPurchaseHide = (res) => {
    console.log("res", res);
    if (res) this.updateUserList();
    this.setState({modal_ticket_purchase_show: false})
  };

  render() {
    const {user_list, modal_ticket_purchase_show, open_index} = this.state;
    const {toast_loading, toast_text, toast_status} = this.state;

    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="container">
          <AtToast isOpened={toast_loading} text={toast_text} status={toast_status} duration={0} hasMask/>
          <ModalTicketPurchase
            isOpened={modal_ticket_purchase_show}
            onHide={this.modalTicketPurchaseHide.bind(this)}
          />
          <View class="ticket-list">
            {user_list.length > 0 ?
              user_list.map((item, index) => (
                <AtCard
                  isFull={true}
                  note={item["email"]}
                  extra={`工号：${item["work_no"]}`}
                  title={`姓名：${item["real_name"]}`}
                  // thumb='http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'
                >
                </AtCard>
              )) :
              <AtListItem className="item" title="本周还未领取优惠券"/>
            }
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
