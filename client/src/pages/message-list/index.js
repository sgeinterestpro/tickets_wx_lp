/**
 * muumlover@2019-05-27
 * 票券领取列表页面
 * 1、显示用户本周已领取的票券
 * 2、提供领取票券入口
 * 3、TODO 显示历史票券
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtList, AtListItem, AtModal, AtToast} from "taro-ui";
import "./index.scss"
import {messageAction, messageList} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "消息列表",
    // enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments);
    this.state = {
      tOpened: false,
      tText: "执行中...",
      tStatus: "loading",
      mOpened: false,
      modalTicketPurchaseState: false,
      openIndex: -1,
      messageList: Taro.getStorageSync("message-list-messageList") || [],
      messageNow: {},
    }
  }

  /**
   * 页面显示事件，触发更新数据
   */
  componentDidShow() {
    this.updateMessageList();
  }

  updateMessageList() {
    messageList().then(res => {
      if (res.code === 0) {
        let messageListNew = [];
        res.items.map((item) => {
          messageListNew.push(item)
        });
        Taro.setStorage({key: 'message-list-messageList', data: messageListNew}).then();
        this.setState({messageList: messageListNew, openIndex: -1});
      } else {
        Taro.showModal({title: "失败", content: res.message, showCancel: false}).then();
      }
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "获取消息列表失败", showCancel: false}).then();
    });
  };

  onMessageClick = (message) => {
    this.setState({
      messageNow: message,
      mOpened: true,
    });
  };

  onModalConfirm = (message_id) => {
    this.setState({mOpened: false, tOpened: true});
    messageAction(message_id).then(res => {
      if (res.code === 0) {
        this.updateMessageList();
        Taro.showModal({title: "成功", content: res.message, showCancel: false}).then();
        this.setState({tOpened: false});
      } else {
        Taro.showModal({title: "失败", content: res.message, showCancel: false}).then();
        this.setState({tOpened: false});
      }
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "确认操作执行失败", showCancel: false}).then();
      this.setState({tOpened: false});
    });
  };

  onModalCancel = () => {
    this.setState({mOpened: false});
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  render() {
    const {messageList, messageNow} = this.state;
    const {mOpened} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;

    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="bg">
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                   onClose={this.onToastClose.bind(this)}/>
          <AtModal
            isOpened={mOpened}
            title={messageNow["time"]}
            content={messageNow["content"]}
            // closeOnClickOverlay={false}
            confirmText="同意"
            cancelText="返回"
            onConfirm={this.onModalConfirm.bind(this, messageNow["_id"])}
            onCancel={this.onModalCancel.bind(this)}
          />
          <View class="block">
            <View class="list">
              <AtList hasBorder={false}>
                {messageList.length > 0 ?
                  messageList.map((item, index) => (
                    <AtListItem
                      key={index}
                      title={item["content"]}
                      note={item["time"]}
                      disabled={item.state !== "valid"}
                      extraText="查看详情"
                      arrow="right"
                      // thumb={item["state"]}
                      onClick={this.onMessageClick.bind(this, item)}
                    />
                  )) :
                  <AtListItem className="list-item" title="暂无消息"/>
                }
              </AtList>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
