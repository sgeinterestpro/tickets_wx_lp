import Taro from "@tarojs/taro"
import {Button, Picker, Text, View} from "@tarojs/components"
import {AtButton, AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from "taro-ui";
import "../module-index.scss"
import {reportList} from "../../config";
import {reportExport} from "../../apis";

// import {ticketClass, ticketState} from "../../config";

export default class Index extends Taro.Component {
  constructor() {
    super(...arguments);
    let reportClassShow = [];
    let reportClassValue = [];
    let reportClassType = [];
    reportList.map((report) => {
      reportClassShow.push(report['title']);
      reportClassValue.push(report['api']);
      reportClassType.push(report['type']);
    });
    this.state = {
      reportTypeSelect: -1,
      reportClassShow,
      reportClassValue,
      reportClassType,
      tOpened: false,
      tText: "加载中...",
      tStatus: "loading",
      tDuration: 3000,
    }
  }

  onClose = (res) => {
    this.props.onClose(res);
  };

  /**
   * 选择报表类型
   */
  onReportChange = e => {
    console.log(e);
    this.setState({
      reportTypeSelect: e.detail.value
    })
  };

  onDateChange = (date, e) => {
    let stateUpdate = {};
    const val = e.detail.value;
    stateUpdate[date] = Array.isArray(val) ? val.join("-") : val;
    this.setState(stateUpdate)
  };

  /**
   * 查询扫描记录
   */
  handleSubmitClick = (reportClass) => {
    let {dateStart, dateEnd} = this.state;
    this.setState({tOpened: true, tText: "正在导出报表", tStatus: "loading", tDuration: 0});
    if (dateEnd === undefined) dateEnd = dateStart;
    reportExport(reportClass, dateStart, dateEnd).then(res => {
      if (res.code !== 0) {
        console.error(res);
        this.setState({tOpened: true, tText: res.message, tStatus: "error", tDuration: 3000});
      } else {
        this.setState({tOpened: true, tText: "报表导出成功", tStatus: "success", tDuration: 3000});
      }
    }).catch(err => {
      console.error(err);
      this.setState({tOpened: true, tText: "服务器繁忙", tStatus: "error", tDuration: 3000});
    });
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  render() {
    const {isOpened} = this.props;
    const {reportTypeSelect, reportClassShow, reportClassValue, reportClassType} = this.state;
    const {dateStart, dateEnd} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;
    let afterConfig = null;
    if (isOpened) {
      switch (reportClassType[reportTypeSelect]) {
        case "month": {
          afterConfig = <View>

          </View>;
          break
        }
        case "month-span": {
          afterConfig = <View>

          </View>;
          break
        }
        case "day": {
          afterConfig = <View>
            <View className="section">
              <View className="section-title">
                <Text>选择导出日期</Text>
              </View>
              <View className="section-text">
                <Picker mode="date" value={dateStart} onChange={this.onDateChange.bind(this, "dateStart")}>
                  <View className="section-picker">当前选择：{dateStart}</View>
                </Picker>
              </View>
            </View>
          </View>;
          break
        }
        case "day-span": {
          // noinspection JSXNamespaceValidation
          afterConfig = (<View>
            <View className="section">
              <View className="section-title">
                <Text>选择开始日期</Text>
              </View>
              <View className="section-text">
                <Picker mode="date" value={dateStart} onChange={this.onDateChange.bind(this, "dateStart")}>
                  <View className="section-picker">当前选择：{dateStart}</View>
                </Picker>
              </View>
            </View>
            <View className="section">
              <View className="section-title">
                <Text>选择结束日期</Text>
              </View>
              <View className="section-text">
                <Picker mode="date" value={dateEnd} onChange={this.onDateChange.bind(this, "dateEnd")}>
                  <View className="section-picker">当前选择：{dateEnd}</View>
                </Picker>
              </View>
            </View>
          </View>);
          break
        }
        default: {
          break
        }
      }
    }
    // noinspection JSXNamespaceValidation
    return (
      isOpened &&
      <AtModal closeOnClickOverlay={false} isOpened={isOpened} onClose={this.onClose}>
        <AtModalHeader>报表导出</AtModalHeader>
        <AtModalContent>
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                   onClose={this.onToastClose.bind(this)}/>
          <View class="section-container">
            <View className="section">
              <View className="section-title">
                <Text>报表类型选择</Text>
              </View>
              <View className="section-text">
                <Picker
                  mode="selector"
                  range={reportClassShow}
                  value={reportTypeSelect}
                  onChange={this.onReportChange.bind(this)}
                >
                  <View className="section-picker">
                    当前选择：{reportClassShow[reportTypeSelect]}
                  </View>
                </Picker>
              </View>
            </View>
            {afterConfig}
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.onClose.bind(this, "")}>取消</Button>
          <Button
            disabled={!reportClassShow[reportTypeSelect]}
            onClick={this.handleSubmitClick.bind(this, reportClassValue[reportTypeSelect])}
          >
            确定
          </Button>
        </AtModalAction>
      </AtModal>
    )
  }
}
