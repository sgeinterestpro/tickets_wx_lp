/**
 * muumlover@2019-05-27
 * 票券检查对话框
 * 1、显示票券和领取用户的基本信息
 */
import Taro, {Component} from "@tarojs/taro"
import {Button, Text, View} from "@tarojs/components"
import {AtFloatLayout, AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from "taro-ui"
import {checkedTicket, inspectTicket} from "../../apis";
import "../module-index.scss"
import {ticketClass} from "../../config";

export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      tOpened: true,
      tText: "票券信息加载中...",
      tDuration: 3000,
      ticketShow: false,
      ticket: {},
      user: {},
      member: {}
    }
  }

  onReturn = (res) => {
    this.setState({tOpened: true, ticketShow: false});
    this.props.onReturn(res);
  };

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props["isOpened"] === true && prevProps["isOpened"] === false) {
      const {ticketId} = this.props;
      //查询并显示票券详细信息
      inspectTicket(ticketId).then((res) => {
        this.setState({tOpened: false});
        if (res.code !== 0) {
          Taro.showModal({content: res.message, showCancel: false}).then(() => {
            this.onReturn(false);
          });
        } else {
          this.setState({
            ticketShow: true,
            ticket: res['ticket'],
            user: res['user'],
            member: res['init'],
          });
        }
      }).catch(()=>{
        Taro.showModal({content: '系统错误', showCancel: false}).then(() => {
          this.onReturn(false);
        });
      });
    }
  }

  /**
   * 提交使用票券
   */
  onConfirm = (ticketId) => {
    this.setState({tOpened: true, tText: "使用请求中.."});
    checkedTicket(ticketId).then((res) => {
      this.setState({tOpened: false});
      if (res.code !== 0) {
        Taro.showModal({content: res.message, showCancel: false}).then(() => {
          this.onReturn(false);
        })
      } else {
        Taro.showModal({content: "使用成功", showCancel: false}).then(() => {
          this.onReturn(true);
        })
      }
    })
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  render() {
    const {isOpened, ticketId} = this.props;
    const {ticketShow, ticket, member} = this.state;
    const {tOpened, tText, tDuration} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      isOpened &&
      <View class="container">
        <AtToast isOpened={tOpened} text={tText} status="loading" duration={0} hasMask={tDuration === 0}
                 onClose={this.onToastClose.bind(this)}/>
        <AtModal isOpened={ticketShow} onClose={this.onReturn.bind(this)}>
          <AtModalHeader>票券详情</AtModalHeader>
          <AtModalContent>
            <View className="page-section">
              <View className="page-section-title">
                <Text>运动项目：{ticketClass[ticket["class"]]}</Text>
              </View>
              <View className="page-section-title">
                <Text>电子券码：{(ticket["_id"] || '').substr(0, 20)}</Text>
              </View>
              <View className="page-section-title">
                <Text>有效日期：{ticket["expiry_date"]}</Text>
              </View>
              <View className="page-section-title">
                <Text>用户姓名：{member['real_name']}</Text>
              </View>
              {ticket["state"] !== "valid" &&
              <View className="page-section-title">
                <Text>该票券无法使用</Text>
              </View>}
            </View>
          </AtModalContent>
          <AtModalAction>
            {ticket["state"] === "valid" &&
            <Button onClick={this.onConfirm.bind(this, ticketId)}>立即使用</Button>}
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
