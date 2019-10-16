import Taro from "@tarojs/taro"
import {Text, View} from "@tarojs/components"
import {AtBadge, AtButton, AtGrid, AtLoadMore, AtProgress, AtToast} from "taro-ui";
import "./index.scss"
import GenerateModule from "../../component/module-generate"
import ReportModule from "../../component/module-report"
import SystemModule from "../../component/module-system"
import TicketTabBar from "../../component/tab-bar"
import {messageCount, ticketLog, ticketUsage} from "../../apis";
import {ticketOption} from "../../config";

import imgGenerate from "../../img/action/generate.png"
import imgReport from "../../img/action/report.png"
import imgSystem from "../../img/action/system.png"

// import {ticketClass, ticketState} from "../../config";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "票券管理",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      tOpened: false,
      tText: "加载中...",
      tStatus: "loading",
      moduleGenerateShow: false,
      moduleReportShow: false,
      moduleSystemShow: false,
      generateCount: 0,
      messageCount: Taro.getStorageSync('ticket-manage-messageCount') || 0,
      lastCount: Taro.getStorageSync('ticket-manage-lastCount') || 0,
      usedCount: Taro.getStorageSync('ticket-manage-usedCount') || 0,
      ticketLogList: Taro.getStorageSync('ticket-manage-logList') || [],
      status: "more"
    }
  }

  /**
   * 页面显示事件，触发更新数据
   */
  componentDidShow() {
    this.updateTicketUsage();
    this.updateMessageCount();
    this.updateTicketLogList();
  }

  /**
   * 更新票券使用量
   */
  updateTicketUsage = () => {
    if (this.first === undefined) {
      this.first = true;
    }
    ticketUsage().then(res => {
      if (res.code === 0) {
        let ticketCounts = res.data;
        let lastCount = 0;
        let usedCount = 0;
        for (let count of Object.keys(ticketCounts)) {
          if (count === 'default') {
            lastCount += ticketCounts[count]
          } else {
            usedCount += ticketCounts[count]
          }
        }
        Taro.setStorage({key: 'ticket-manage-lastCount', data: lastCount}).then();
        Taro.setStorage({key: 'ticket-manage-usedCount', data: usedCount}).then();
        this.setState({lastCount, usedCount})
      } else {
        throw `res.code = ${res.code}`;
      }
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "获取票券使用信息失败", showCancel: false}).then();
    });
  };

  /**
   * 更新消息数量
   */
  updateMessageCount() {
    messageCount().then(res => {
      if (res.code === 0) {
        Taro.setStorage({key: 'ticket-manage-messageCount', data: res.count}).then();
        this.setState({messageCount: res.count});
      } else {
        throw `res.code = ${res.code}`;
      }
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "获取消息数量失败", showCancel: false}).then();
    });
  };

  /**
   * 更新票券使用记录
   */
  updateTicketLogList = (append = false, limit = 5) => {
    let {ticketLogList} = this.state;
    let skip = 0;
    if (append) {
      skip = ticketLogList.length;
    }
    if (this.first === undefined) {
      this.first = true;
    }
    return new Promise((resolve, reject) => {
      ticketLog(skip, limit).then(res => {
        if (append) {
          ticketLogList = ticketLogList.concat(res.items);
        } else {
          ticketLogList = res.items;
        }
        Taro.setStorage({key: 'ticket-manage-logList', data: ticketLogList}).then();
        this.setState({ticketLogList, openIndex: -1, tOpened: false, status: "more"});
        resolve(res.items.length === limit);
      }).catch(err => {
        console.error(err);
        Taro.showModal({title: "错误", content: "获取票券使用记录失败", showCancel: false}).then();
        reject()
      });
    });
  };

  /**
   * 系统设置按钮点击
   */
  handleModuleShow = (item, index) => {
    let newState = {};
    newState[item.data0] = true;
    this.setState(newState);
  };

  /**
   * 领券中心弹窗返回
   * @constructor
   */
  handleModuleClose = (res) => {
    console.debug("res", res);
    this.setState({
      moduleGenerateShow: false,
      moduleReportShow: false,
      moduleSystemShow: false,
    });
    if (res === "generate") {
      this.updateTicketUsage();
      this.updateMessageCount();
      this.updateTicketLogList();
    }
  };

  handleClick = () => {
    this.setState({status: "loading"});
    this.updateTicketLogList(true).then((res) => {
      if (res)
        this.setState({status: "more"});
      else
        this.setState({status: "noMore"});
    }).catch(err => {
      console.error(err);
      this.setState({status: "more"})
    });
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  onMessageViewClick = () => {
    Taro.navigateTo({url: '/pages/message-list/index'}).then()
  };

  render() {
    const {moduleGenerateShow, moduleReportShow, moduleSystemShow} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;
    const {lastCount, usedCount} = this.state;
    const {ticketLogList} = this.state;
    // const percent = 100 * (lastCount / ((usedCount + usedCount) || 1));
    const percent = 100 * (lastCount / 500);
    const {messageCount} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="bg">
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                   onClose={this.onToastClose.bind(this)}/>
          <GenerateModule isOpened={moduleGenerateShow} onClose={this.handleModuleClose.bind(this)}/>
          <ReportModule isOpened={moduleReportShow} onClose={this.handleModuleClose.bind(this)}/>
          <SystemModule isOpened={moduleSystemShow} onClose={this.handleModuleClose.bind(this)}/>
          <View class="block">
            <View class="body">
              <AtProgress className="info-progress" percent={percent} isHidePercent status="progress" strokeWidth={20}/>
              <View className="at-row">
                <View className="at-col info-item">
                  <View className="item-title">库存剩余数量</View>
                  <View className="item-body">
                    <Text className="item-text">{lastCount}</Text><Text className="item-unit">张</Text>
                  </View>
                </View>
                <View className="at-col info-item">
                  <View className="item-title">当月消耗数量</View>
                  <View className="item-body">
                    <Text className="item-text">{usedCount}</Text><Text className="item-unit">张</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {messageCount > 0 && <View class="block">
            <View class="cell">
              <View class="cell-title">您有新的待处理任务</View>
              <View class="cell-extra">
                <AtBadge value={messageCount} maxValue={99}>
                  <AtButton size='small' onClick={this.onMessageViewClick.bind(this)}>去处理</AtButton>
                </AtBadge>
              </View>
            </View>
          </View>}
          <View class="block">
            <View class="body">
              <AtGrid hasBorder={false} data={
                [
                  {
                    image: imgGenerate,
                    value: '增发票券',
                    data0: 'moduleGenerateShow'
                  },
                  {
                    image: imgReport,
                    value: '报表导出',
                    data0: 'moduleReportShow'
                  },
                  {
                    image: imgSystem,
                    value: '系统设置',
                    data0: 'moduleSystemShow'
                  }
                ]
              } onClick={this.handleModuleShow.bind(this)}/>
            </View>
          </View>
          <View class="block">
            <View class="list">
              {ticketLogList.length > 0 ?
                <View>
                  {ticketLogList.map((item, index) => (
                    <View key={index} class="list-item">
                      <View class="time">{item.time}</View>
                      <View class="text">
                        {`${ticketOption[item["option"]]} ${item["ticket_id"].substr(0, 20)} ${item["real_name"]}`}
                      </View>
                    </View>
                  ))}
                  <AtLoadMore
                    className={"list-item more-fix"}
                    status={this.state.status}
                    onClick={this.handleClick.bind(this)}
                  />
                </View>
                :
                <View class="list-item none">没有记录</View>
              }
            </View>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
