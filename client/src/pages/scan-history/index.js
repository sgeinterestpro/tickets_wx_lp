/**
 * muumlover@2019-05-27
 * 票券扫描页面
 * 1、提供扫描票券功能
 * 2、显示票券信息供人工核实
 * 3、TODO 显示扫描历史
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtButton, AtCalendar, AtFloatLayout, AtPagination} from "taro-ui"
import "./index.scss"
import TicketTabBar from "../../component/tab-bar"
import {ticketClass} from "../../config";
import {ticketCheckLog} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "扫描历史",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      floatLayoutShow: false,
      startDate: '',
      endDate: '',
      ticketScanList: []
    }
  }

  // componentDidMount() {
  //   Taro.startPullDownRefresh();
  // }

  // onPullDownRefresh() {
  //   this.updateTicketCheckLogList();
  // }

  // /**
  //  * 更新票券列表记录
  //  */
  // updateTicketCheckLogList = () => {
  //   let {ticketCheckLogList} = this.state;
  //   const nowDate = getNowDay();
  //   ticketCheckLog(nowDate).then(res => {
  //     ticketCheckLogList = res.items;
  //     Taro.stopPullDownRefresh();
  //     Taro.showToast({title: "加载成功", icon: "none", duration: 500});
  //     this.setState({ticketCheckLogList, openIndex: -1, tOpened: false});
  //   }).catch(err => {
  //     console.error(err);
  //     Taro.stopPullDownRefresh();
  //     Taro.showToast({title: "加载失败", icon: "none", duration: 500});
  //   });
  // };

  /**
   * 保存输入框数据更改
   */
  handleInputFocus = () => {
    this.setState({floatLayoutShow: true})
  };
  handleFloatLayoutClose = () => {
    this.setState({floatLayoutShow: false})
  };
  handleCalendarChange = (res) => {
    console.debug(res.value);
    if (res.value.end) {
      this.setState({startDate: res.value.start, endDate: res.value.end})
    }
  };

  /**
   * 查询扫描记录
   */
  handleQueryClick = () => {
    let {startDate, endDate, ticketScanList} = this.state;
    ticketCheckLog(startDate, endDate).then(res => {
      if (res.code !== 0) {
        console.error(res);
        Taro.stopPullDownRefresh();
        Taro.showToast({title: res.message, icon: "none", duration: 2000});
      } else {
        ticketScanList = res.items;
        Taro.stopPullDownRefresh();
        Taro.showToast({title: "加载成功", icon: "none", duration: 500});
        this.setState({ticketScanList});
      }
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载失败", icon: "none", duration: 500});
    });
  };

  render() {
    const {floatLayoutShow, startDate, endDate, ticketScanList} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <AtFloatLayout isOpened={floatLayoutShow} title="请选择查询日期" onClose={this.handleFloatLayoutClose.bind(this)}>
          <AtCalendar isMultiSelect onSelectDate={this.handleCalendarChange.bind(this)}/>
        </AtFloatLayout>
        <View class="tickets-scan">
          <View class="input-container">
            <View class="text-view">
              <View class="text-value"
                    onClick={this.handleInputFocus.bind(this)}>
                {endDate ? `${startDate} 至 ${endDate}` : "请选择查询日期"}
              </View>
              <AtButton type="primary" onClick={this.handleQueryClick.bind(this)}>查询</AtButton>
            </View>
          </View>
        </View>
        <View class="block">
          <View class="list">
            {ticketScanList.length > 0 ?
              <View>
                <View class="item">
                  <View class="text">
                    {`查询到 ${ticketScanList.length} 条记录`}
                  </View>
                </View>
                {ticketScanList.map((item, index) => (
                  <View key={index} class="item">
                    <View>{`编号：${item["_id"].substr(0, 20)}`}</View>
                    <View>{`用户：${item["user_init"]["real_name"] || "已注销"}`}</View>
                    <View>{`项目：${ticketClass[item["class"]]}`}</View>
                    <View class="time">{`时间：${item["check_time"]}`}</View>
                  </View>
                ))}
              </View>
              :
              <View class="item none">没有记录</View>
            }
          </View>
          <View class="pagination">
            <AtPagination
              total={ticketScanList.length}
              pageSize={10}
              current={1}
            >
            </AtPagination>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
