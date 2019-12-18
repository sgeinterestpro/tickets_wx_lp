/*
 * Copyright (c) 2019 by Sam Wang.
 *
 * File: index.js
 * Project: tickets_wx_lp
 * File Created: 2019-10-31 05:39:18
 * Author: Sam Wang <muumlover@live.com> https://blog.ronpy.com
 *
 * Last Modified: 2019-12-10 04:29:55 by Sam Wang
 *
 */

import {View} from "@tarojs/components"
import Taro from "@tarojs/taro"
import {AtButton, AtCalendar, AtFloatLayout, AtPagination, AtSegmentedControl} from "taro-ui"
import {ticketCheckCount, ticketCheckLog} from "../../apis"
import TicketTabBar from "../../component/tab-bar"
import "./index.scss"

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
      current: 0,
      floatLayoutShow: false,
      startDate: undefined,
      endDate: undefined,
      overViewList: Taro.getStorageSync('scan-history-overViewList') || [],
      ticketScanList: []
    }
  }

  componentDidMount() {
    this.updateTicketCheckLog();
  }

  /**
   * 更新票券列表记录
   */
  updateTicketCheckLog = () => {
    this.queryCheckCount();
  };

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
   * 查询扫描统计
   */
  queryCheckCount = () => {
    let {startDate, endDate, overViewList} = this.state;
    ticketCheckCount(startDate, endDate).then(res => {
      overViewList = res.items;
      this.setState({overViewList});
      Taro.setStorage({key: 'scan-history-overViewList', data: overViewList}).then();
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
    });
  };

  /**
   * 查询扫描记录
   */
  queryCheckLog = (startDate, endDate) => {
    let {ticketScanList} = this.state;
    ticketCheckLog(startDate, endDate).then(res => {
      if (res.code !== 0) {
        console.error(res);
        Taro.stopPullDownRefresh();
        Taro.showToast({title: res.message, icon: "none", duration: 2000}).then();
      } else {
        ticketScanList = res.items;
        Taro.stopPullDownRefresh();
        Taro.showToast({title: "加载成功", icon: "none", duration: 500}).then();
        this.setState({ticketScanList});
      }
    }).catch(err => {
      console.error(err);
      Taro.stopPullDownRefresh();
      Taro.showToast({title: "加载失败", icon: "none", duration: 500}).then();
    });
  };

  handleClick(value) {
    this.setState({
      current: value
    })
  }

  render() {
    const {floatLayoutShow, startDate, endDate, ticketScanList, overViewList} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <AtFloatLayout isOpened={floatLayoutShow} title="请选择查询日期" onClose={this.handleFloatLayoutClose.bind(this)}>
          <AtCalendar isMultiSelect onSelectDate={this.handleCalendarChange.bind(this)}/>
        </AtFloatLayout>
        <View class="block">
          <View class="body">
            <AtSegmentedControl
              values={['本周', '上周', '本月', '自定义']}
              onClick={this.handleClick.bind(this)}
              current={this.state.current}
            />
            <View className='tab-content'>              {
              this.state.current === 3 ? <View>
                <View class="search">
                  <View class="input-container">
                    <View class="text-view">
                      <View class="text-value"
                            onClick={this.handleInputFocus.bind(this)}>
                        {endDate ? `${startDate} 至 ${endDate}` : "请选择查询日期范围"}
                      </View>
                      <AtButton type="primary" onClick={this.queryCheckCount.bind(this)}>查询</AtButton>
                    </View>
                  </View>
                </View>
              </View> : null}
              {overViewList && overViewList.length > 0 ? <View>
                <View className='at-row at-row--wrap'>
                  {overViewList[this.state.current].items.map((items, index) => (
                    <View className='at-col at-col-4 grid' key={index}>
                      <View className='name'>{items.name}</View>
                      <View className='count'>检票{items.count}张</View>
                    </View>
                  ))}
                  <View className='at-col at-col-4 grid'>
                    <AtButton type="secondary" onClick={this.queryCheckLog.bind(this,
                      overViewList[this.state.current].start,
                      overViewList[this.state.current].end,
                    )}> 查看明细 </AtButton>
                  </View>
                </View>
              </View> : null}
            </View>
          </View>
        </View>
        <View class="block">
          <View class="body">
            <View class="list">
              {ticketScanList.length > 0 ?
                <View>
                  <View class="list-item">
                    <View class="text">
                      {`查询到 ${ticketScanList.length} 条记录`}
                    </View>
                  </View>
                  {ticketScanList.map((items, index) => (
                    <View key={index} class="list-item">
                      {items.map((item, index) => (
                        <View key={index} class="text">{item}</View>
                      ))}
                    </View>
                  ))}
                </View>
                :
                <View class="list-item none">没有记录</View>}
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
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
