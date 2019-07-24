/**
 * muumlover@2019-05-27
 * 票券扫描页面
 * 1、提供扫描票券功能
 * 2、显示票券信息供人工核实
 * 3、TODO 显示扫描历史
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtCalendar, AtTabs, AtTabsPane, AtToast} from "taro-ui"
import "./index.scss"
import {reportList} from "../../config";
import {reportExport} from "../../apis";
import TicketTabBar from "../../component/tab-bar";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "报表管理",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      current: 0,
      startDate: '',
      endDate: ''
    }
  }

  /**
   * 保存输入框数据更改
   */
  handleCalendarChange = (res) => {
    console.debug(res.value);
    if (res.value.end) {
      this.setState({startDate: res.value.start, endDate: res.value.end})
    }
  };

  /**
   * 查询扫描记录
   */
  handleQueryClick = (report) => {
    let {startDate, endDate, ticketScanList} = this.state;
    this.setState({tOpened: true, tText: "正在导出报表", tStatus: "loading", tDuration: 0});
    reportExport(report['api'], startDate, endDate).then(res => {
      if (res.code !== 0) {
        console.error(res);
        Taro.stopPullDownRefresh();
        this.setState({tOpened: true, tText: res.message, tStatus: "error", tDuration: 3000});
      } else {
        ticketScanList = res.items;
        Taro.stopPullDownRefresh();
        this.setState({tOpened: true, tText: "报表导出成功", tStatus: "success", tDuration: 3000});
        this.setState({ticketScanList});
      }
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      this.setState({tOpened: true, tText: "服务器繁忙", tStatus: "error", tDuration: 3000});
    });
  };

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  render() {
    const {startDate, endDate} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg bg-tab">
        <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                 onClose={this.onToastClose.bind(this)}/>
        <View class="tickets-scan">
          <AtTabs
            current={this.state.current}
            scroll
            tabList={reportList}
            onClick={this.handleClick.bind(this)}>
            {reportList.map((report, index) => (
              <AtTabsPane key={index} current={this.state.current} index={index}>
                <View class="input-container">
                  <View class="text-view">
                    <View class="text-value">
                      {report['type'] === "timespan" ?
                        (endDate ? `${startDate} 至 ${endDate}` : "请选择查询日期") :
                        report['type'] === "time" ?
                          (endDate ? `已选 ${endDate}` : "请选择查询日期") :
                          (report['type'] + "不被支持")}
                    </View>
                    <AtButton type="primary" onClick={this.handleQueryClick.bind(this, report)}>导出</AtButton>
                  </View>
                  <View>
                    <AtCalendar isMultiSelect={report['type'] === "timespan"}
                                onSelectDate={this.handleCalendarChange.bind(this)}/>
                  </View>
                </View>
              </AtTabsPane>
            ))}
          </AtTabs>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}