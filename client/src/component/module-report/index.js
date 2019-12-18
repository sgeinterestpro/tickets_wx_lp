import Taro from "@tarojs/taro"
import {Button, Picker, Text, View} from "@tarojs/components"
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from "taro-ui";
import "../module-index.scss"
import {reportExport} from "../../apis";
import {getNowDate} from "../../common/getWeek";


export default class Index extends Taro.Component {
  constructor() {
    super(...arguments);
    this.reportList = Taro.getStorageSync("ticket-manage-reportList") || [];
    console.debug("reportList", this.reportList);
    let reportTitleList = [];
    this.reportList.map((report) => {
      reportTitleList.push(report["title"]);
    });
    this.state = {
      reportTitleList,
      reportSelectIndex: -1,
      reportSelect: {},
      tOpened: false,
      tText: "加载中...",
      tStatus: "loading",
      tDuration: 3000,
      dataIndex: {},
      dataSubmit: {}
    }
  }

  onClose = (res) => {
    this.props.onClose(res);
  };

  /**
   * 选择报表类型
   */
  onReportChange = e => {
    console.debug("e", e);
    const reportSelectIndex = e.detail.value;
    this.setState({
      reportSelectIndex,
      reportSelect: this.reportList[reportSelectIndex],
    })
  };

  onDateChange = (reportType, fieldKey, valueRange, e) => {
    console.debug("reportType", reportType, "fieldKey", fieldKey, "valueRange", valueRange, "e", e);
    const {dataIndex, dataSubmit} = this.state;

    const val = e.detail.value;
    dataIndex[reportType] = dataIndex[reportType] || {};
    dataIndex[reportType][fieldKey] = Array.isArray(val) ? val.join("-") : val;

    const valSubmit = Object.keys(valueRange).length ? valueRange[val] : val;
    dataSubmit[reportType] = dataSubmit[reportType] || {};
    dataSubmit[reportType][fieldKey] = Array.isArray(valSubmit) ? valSubmit.join("-") : valSubmit;

    this.setState({dataIndex, dataSubmit})
  };

  /**
   * 查询扫描记录
   */
  handleSubmitClick = (reportType) => {
    let {dataSubmit} = this.state;
    this.setState({tOpened: true, tText: "正在导出报表", tStatus: "loading", tDuration: 0});
    // if (dateEnd === undefined) dateEnd = dateStart;
    reportExport(reportType, dataSubmit[reportType]).then(res => {
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
    const {reportTitleList, reportSelectIndex, reportSelect} = this.state;
    const {tOpened, tText, tStatus, tDuration} = this.state;
    const {dataIndex} = this.state;
    const dateNow = getNowDate();
    const reportFields = reportSelect["params"] || {};
    console.debug("reportFields", reportFields);
    const reportType = reportSelect["api"];
    console.debug("reportType", reportType);
    const fieldKeys = Object.keys(reportFields) || [];
    console.debug("fieldKeys", fieldKeys);
    const reportData = dataIndex[reportType] || {};
    console.debug("reportData", reportData);
    // noinspection JSXNamespaceValidation
    return (
      <AtModal closeOnClickOverlay={false} isOpened={true} onClose={this.onClose}>
        <AtModalHeader>报表导出</AtModalHeader>
        <AtModalContent>
          <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={tDuration} hasMask={tDuration === 0}
                   onClose={this.onToastClose.bind(this)}/>
          <View class="section-container">
            <View className="section">
              <View className="section-title">
                <Text>报表类型</Text>
              </View>
              <View className="section-text">
                <Picker mode="selector"
                        range={reportTitleList}
                        value={reportSelectIndex}
                        onChange={this.onReportChange.bind(this)}
                >
                  <View className="section-picker">
                    当前选择：{reportSelect["title"]}
                  </View>
                </Picker>
              </View>
            </View>
            <View> {
              fieldKeys.map((fieldKey, index) => {
                const value = reportData[fieldKey];
                const fieldBody = reportFields[fieldKey];
                let valueRange = fieldBody["values"] || {};
                let mode = fieldBody["values"] ? "selector" : "date";
                let valueShow = fieldBody["values"] ? valueRange[value] : value;
                let type = fieldBody["type"];
                // noinspection JSXNamespaceValidation
                return (<View className="section" key={index}>
                  <View className="section-title">
                    <Text>{fieldBody["title"]}</Text>
                  </View>
                  <View className="section-text">
                    <Picker mode={mode}
                            range={valueRange}
                            end={dateNow}
                            value={value}
                            fields={type}
                            onChange={this.onDateChange.bind(this, reportType, fieldKey, valueRange)}
                    >
                      <View className="section-picker">当前选择：{valueShow}</View>
                    </Picker>
                  </View>
                </View>)
              })
            } </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.onClose.bind(this, "")}>取消</Button>
          <Button disabled={!reportSelect} onClick={this.handleSubmitClick.bind(this, reportSelect["api"])}>
            确定
          </Button>
        </AtModalAction>
      </AtModal>
    )
  }
}
