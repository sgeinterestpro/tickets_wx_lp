/**
 * muumlover@2019-05-27
 * 票券扫描页面
 * 1、提供扫描票券功能
 * 2、显示票券信息供人工核实
 * 3、TODO 显示扫描历史
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtInput} from "taro-ui"
import "./index.scss"
import TicketTabBar from "../../component/tab-bar"
import ModalTicketDisplay from "../../component/modal-ticket-checked";
import {ticketClass} from "../../config";
import {ticketCheckLog} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "票券使用",
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments);
    this.state = {
      ticketId: "",
      modalTicketDisplayShow: false,
      ticketCheckLogList: []
    }
  }

  componentDidMount() {
    Taro.startPullDownRefresh();
  }

  onPullDownRefresh() {
    this.updateTicketCheckLogList();
  }

  /**
   * 更新票券列表记录
   */
  updateTicketCheckLogList = () => {
    let {ticketCheckLogList} = this.state;
    // const nowDate = getNowDay();
    ticketCheckLog().then(res => {
      ticketCheckLogList = res.items;
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载成功", icon: "none", duration: 500});
      this.setState({ticketCheckLogList, openIndex: -1, tOpened: false});
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载失败", icon: "none", duration: 500});
    });
  };

  /**
   * 保存输入框数据更改
   * @param value
   */
  handleInputChange = (value) => {
    this.setState({ticketId: value})
  };

  /**
   * 开启微信扫描
   */
  onBtnScanClick = () => {
    Taro.scanCode().then((res) => this.modalTicketDisplayShow(res.result))
  };

  /**
   * 显示票券详情对话框
   * @param ticketId 票券ID
   */
  modalTicketDisplayShow = (ticketId) => {
    this.setState({ticketId, modalTicketDisplayShow: true,})
  };

  /**
   * 关闭券详情对话框操作
   */
  modalTicketDisplayReturn = (res) => {
    if (res) this.updateTicketCheckLogList();
    this.setState({ticketId: "", modalTicketDisplayShow: false});
  };

  render() {
    const {ticketId, modalTicketDisplayShow, ticketCheckLogList} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="container">
        <ModalTicketDisplay
          isOpened={modalTicketDisplayShow}
          onReturn={this.modalTicketDisplayReturn.bind(this)}
          ticketId={ticketId}
        />
        <View class="tickets-scan">
          <View class="input-container">
            <AtInput border={false} value={ticketId} onChange={this.handleInputChange.bind(this)}
                     placeholder="扫描或输入票券编号"
            >
              <AtButton type="primary" onClick={this.modalTicketDisplayShow.bind(this, ticketId)}>确定</AtButton>
            </AtInput>
            <AtButton type="primary" onClick={this.onBtnScanClick.bind(this)}>扫描</AtButton>
          </View>
          <View class="btn-submit">
          </View>
        </View>
        <View class="ticket-log">
          <View class="list">
            {ticketCheckLogList.length > 0 ?
              <View>
                <View class="item">
                  <View class="text">
                    {`今日已扫描 ${ticketCheckLogList.length} 张`}
                  </View>
                </View>
                {ticketCheckLogList.map((item, index) => (
                  <View key={index} class="item">
                    <View class="text">{`编号：${item["_id"].substr(0, 20)}`}</View>
                    <View class="text">{`用户：${item["user_init"]["real_name"] || "已注销"}`}</View>
                    <View class="text">{`项目：${ticketClass[item["class"]]}`}</View>
                    <View class="time">{`时间：${item["check_time"]}`}</View>
                  </View>
                ))}
              </View>
              :
              <View class="item none">没有记录</View>
            }
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
