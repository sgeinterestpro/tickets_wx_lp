import Taro from "@tarojs/taro"
import {Text, View} from "@tarojs/components"
import {AtButton, AtLoadMore, AtProgress, AtToast} from "taro-ui";
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
    enablePullDownRefresh: true,
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
      lastCount: 0,
      usedCount: 0,
      ticketLogList: [],
      status: "more"
    }
  }

  componentDidShow() {
    Taro.startPullDownRefresh().then();
  }

  onPullDownRefresh() {
    this.updateTicketUsage();
    this.updateTicketLogList();
    this.setState({status: "more"});
  }

  /**
   * 更新票券列表显示
   */
  updateTicketUsage = () => {
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
        this.setState({lastCount, usedCount})
      }
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载成功", icon: "none", duration: 500}).then();
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载失败", icon: "none", duration: 500}).then();
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
    return new Promise((resolve, reject) => {
      ticketLog(skip, limit).then(res => {
        if (append) {
          ticketLogList = ticketLogList.concat(res.items);
        } else {
          ticketLogList = res.items;
        }
        Taro.stopPullDownRefresh();
        Taro.showToast({title: "加载成功", icon: "none", duration: 500}).then();
        this.setState({ticketLogList, openIndex: -1, tOpened: false});
        resolve(res.items.length === limit)
      }).catch(err => {
        console.error(err);
        Taro.stopPullDownRefresh();
        Taro.showToast({title: "加载失败", icon: "none", duration: 500}).then();
        reject()
      });
    });
  };

  /**
   * 增发票券按钮点击
   */
  handleModuleGenerateShow = () => {
    this.setState({moduleGenerateShow: true});
  };

  /**
   * 增发票券按钮点击
   */
  handleModuleReportShow = () => {
    this.setState({moduleReportShow: true});
  };

  /**
   * 系统设置按钮点击
   */
  handleModuleSystemShow = () => {
    this.setState({moduleSystemShow: true});
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
            <AtButton type="secondary" circle onClick={this.handleModuleGenerateShow.bind(this)}>
              增发票券
            </AtButton>
            <AtButton type="secondary" circle onClick={this.handleModuleReportShow.bind(this)}>
              报表导出
            </AtButton>
            <AtButton type="secondary" circle onClick={this.handleModuleSystemShow.bind(this)}>
              系统设置
            </AtButton>
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
