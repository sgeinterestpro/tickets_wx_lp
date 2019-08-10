import Taro from "@tarojs/taro"
import {Text, View} from "@tarojs/components"
import {AtGrid, AtLoadMore, AtProgress, AtToast} from "taro-ui";
import "./index.scss"
import GenerateModule from "../../component/module-generate"
import ReportModule from "../../component/module-report"
import SystemModule from "../../component/module-system"
import TicketTabBar from "../../component/tab-bar"
import {ticketLog, ticketUsage} from "../../apis";
import {ticketOption} from "../../config";

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
    this.updateTicketLogList();
  }

  /**
   * 更新票券列表显示
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
      }
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
    });
  };

  /**
   * 更新票券列表记录
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
        Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
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

  render() {
    const {moduleGenerateShow, moduleReportShow, moduleSystemShow} = this.state;
    const {tOpened, tText, tStatus} = this.state;
    const {lastCount, usedCount} = this.state;
    const {ticketLogList} = this.state;
    // const percent = 100 * (lastCount / ((usedCount + usedCount) || 1));
    const percent = 100 * (lastCount / 500);
    // noinspection JSXNamespaceValidation
    return (
      <View>
        <View class="bg">
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={0} hasMask/>
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
          <View class="block">
            <View class="body">
              <AtGrid hasBorder={false} data={
                [
                  {
                    image: 'https://i.loli.net/2019/08/08/IO8CtKg1mQRyFAH.png',
                    value: '增发票券',
                    data0: 'moduleGenerateShow'
                  },
                  {
                    image: 'https://i.loli.net/2019/08/08/gIboDypXRYV9hjd.png',
                    value: '报表导出',
                    data0: 'moduleReportShow'
                  },
                  {
                    image: 'https://i.loli.net/2019/08/08/cE8Bz54TtFkjxWd.png',
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
                    <View key={index} class="item">
                      <View class="time">{item.time}</View>
                      <View class="text">
                        {`${ticketOption[item["option"]]} ${item["ticket_id"].substr(0, 20)} ${item["real_name"]}`}
                      </View>
                    </View>
                  ))}
                  <AtLoadMore
                    className={"item item-more"}
                    status={this.state.status}
                    onClick={this.handleClick.bind(this)}
                  />
                </View>
                :
                <View class="item none">没有记录</View>
              }
            </View>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
