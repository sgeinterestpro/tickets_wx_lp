/**
 * muumlover@2019-05-27
 * 票券领取列表页面
 * 1、显示用户本周已领取的票券
 * 2、提供领取票券入口
 * 3、TODO 显示历史票券
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtList, AtListItem, AtSwipeAction, AtToast} from "taro-ui";
import "./index.scss"
import {ticketClass, ticketState} from "../../config";
import TicketTabBar from "../../component/tab-bar"
import ModalTicketPurchase from "../../component/modal-ticket-purchase"
import {refundTicket, ticketPackage} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "票券列表",
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments);
    this.state = {
      tOpened: false,
      tText: "加载中...",
      tStatus: "loading",
      modalTicketPurchaseState: false,
      openIndex: -1,
      ticketList: []
    }
  }

  /**
   * 页面加载完毕事件，触发下拉刷新
   */
  componentDidShow() {
    Taro.startPullDownRefresh();
  }

  /**
   * 页面下拉刷新事件，更新票券列表
   */
  onPullDownRefresh() {
    this.updateTicketList();
  }

  /**
   * 更新页面内票券列表数据
   * 出发下拉刷新加载动画
   */
  updateTicketList = () => {
    ticketPackage().then(res => {
      let ticketListNew = [];
      res.items.map((item) => {
        ticketListNew.push(item)
      });
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载成功", icon: "none", duration: 500});
      this.setState({ticketList: ticketListNew, openIndex: -1, tOpened: false});
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
    this.setState({openIndex: -1});
    Taro.navigateTo({
      url: `/pages/ticket-show/index?id=${item._id}`
    })
  };

  /**
   * 滑动功能区打开,提供删除票券按钮
   * 限制同时只能打开一个票券的滑动功能区
   * @param index
   */
  onSwipeActionOpened = (index) => {
    console.log("onSwipeActionOpened", index);
    this.setState({openIndex: index})
  };

  /**
   * 滑动功能区删除按钮点击事件，处理删除票券
   * @param index
   */
  onSwipeActionClick = (index) => {
    //todo 增加删除确认
    const {ticketList} = this.state;
    const ticket = ticketList[index];
    Taro.showModal({
      title: "删除确认",
      content: "是否删除该票券？",
      confirmText: "取消",
      confirmColor: "#000000",
      cancelText: "删除",
      cancelColor: "#FF0000"
    }).then(res => !res.confirm && res.cancel).then(confirm => {
      if (confirm) {
        // console.log(ticket._id);
        refundTicket(ticket._id).then(res => {
          this.updateTicketList();
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

  /**
   * 领取新票券按钮点击事件
   */
  modalTicketPurchaseShow = () => {
    this.setState({openIndex: -1, modalTicketPurchaseState: true});
  };

  /**
   * 领取票券弹窗返回处理
   * @param res True:用户领取新的票券;False:未领取新的票券
   */
  modalTicketPurchaseHide = (res) => {
    // console.log("res", res);
    if (res) this.updateTicketList();
    this.setState({modalTicketPurchaseState: false})
  };

  render() {
    const {ticketList, modalTicketPurchaseState, openIndex} = this.state;
    const {tOpened, tText, tStatus} = this.state;

    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="container">
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={0} hasMask/>
          <ModalTicketPurchase
            isOpened={modalTicketPurchaseState}
            onHide={this.modalTicketPurchaseHide.bind(this)}
          />
          <View class="ticket-list">
            <AtList>
              {ticketList.length > 0 ?
                ticketList.map((item, index) => (
                  <AtSwipeAction
                    key={index}
                    onClick={this.onSwipeActionClick.bind(this, index)}
                    onOpened={this.onSwipeActionOpened.bind(this, index)}
                    isOpened={index === openIndex}
                    disabled={item.state !== "valid"}
                    autoClose
                    options={[{text: "删除", style: {backgroundColor: "#FF4949"}}]}
                  >
                    <AtListItem
                      className="item"
                      title={ticketClass[item["class"]]}
                      note={item["expiry_date"]}
                      disabled={item.state !== "valid"}
                      extraText={ticketState[item[`state`]]}
                      arrow="right"
                      thumb="https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png"
                      onClick={this.onTicketClick.bind(this, item)}
                    />
                  </AtSwipeAction>
                )) :
                <AtListItem className="item" title="本周还未领取优惠券"/>
              }
            </AtList>
          </View>
          <View class="ticket-apply">
            <AtButton
              type="secondary"
              circle
              disabled={ticketList.length >= 3}
              onClick={this.modalTicketPurchaseShow.bind(this)}
            >
              {ticketList.length >= 3 ? "没有领取额度了" : `本周还可领取${3 - ticketList.length}张`}
            </AtButton>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
