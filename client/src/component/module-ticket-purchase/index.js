/**
 * muumlover@2019-05-27
 * 票券领取对话框
 * 1、显示日期和可领取项目
 */
import Taro from "@tarojs/taro"
import {Button, Picker, Text, View} from "@tarojs/components"
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from "taro-ui"
import "../module-index.scss"
import {ticketClass} from "../../config";
import {getNowDay, getWeekDay} from "../../common/getWeek";
import {purchaseTicket} from "../../apis";

export default class Index extends Taro.Component {

  constructor() {
    super(...arguments);
    const date = new Date();
    const year = date.getFullYear().toString();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    month = (month.length === 1) ? "0" + month : month;
    day = (day.length === 1) ? "0" + day : day;
    let sportList = [];
    const {sports} = Taro.getStorageSync("UesrInfo");
    if (sports) {
      for (let sport of sports) {
        if (ticketClass[sport]) {
          sportList[sport] = ticketClass[sport]
        }
      }
    }
    this.state = {
      tOpened: false,
      tText: "加载中...",
      tStatus: "loading",
      eventShow: Object.values(sportList),
      eventValue: Object.keys(sportList),
      eventSelect: 1,
      dateSel: [year, month, day].join("-")
    }
  }

  onReturn = (res) => {
    this.props.onReturn(res);
  };

  onClassChange = e => {
    this.setState({
      eventSelect: e.detail.value
    })
  };

  onDateChange = e => {
    const val = e.detail.value;
    const dateSel = Array.isArray(val) ? val.join("-") : val;
    this.setState({dateSel})
  };

  onConfirm = () => {
    const {eventShow, eventValue, eventSelect, dateSel} = this.state;
    const data = {
      class: eventValue[eventSelect],
      title: eventShow[eventSelect],
      date: dateSel,
    };
    this.setState({tOpened: true, tText: "领取中...", tStatus: "loading"});
    purchaseTicket(data).then(res => {
      this.setState({tOpened: false});
      if (res.code !== 0) {
        Taro.showModal({title: "错误", content: res.message, showCancel: false}).then();
      } else {
        Taro.showModal({title: "提示", content: "领取成功", showCancel: false}).then();
        this.onReturn(true);
      }
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "警告", content: "网络可能收到了神秘信号的干扰。", showCancel: false}).then();
    });
  };

  onToastClose = () => {
    this.setState({tOpened: false});
  };

  render() {
    const {isOpened} = this.props;
    const {eventShow, eventSelect, dateSel} = this.state;
    const {tOpened, tText, tStatus} = this.state;
    const dateStart = getNowDay();
    const dateEnd = getWeekDay(6);
    // noinspection JSXNamespaceValidation
    return (
      isOpened &&
      <View>
        <AtToast isOpened={tOpened} text={tText} status={tStatus} duration={0} hasMask
                 onClose={this.onToastClose.bind(this)}/>
        <AtModal isOpened={isOpened}>
          <AtModalHeader>领券中心</AtModalHeader>
          <AtModalContent>
            <View class="section-container">
              <View className="section">
                <View className="section-title">
                  <Text>项目选择</Text>
                </View>
                <View className="section-text">
                  <Picker mode="selector" range={eventShow} value={eventSelect}
                          onChange={this.onClassChange.bind(this)}>
                    <View className="section-picker">
                      当前选择：{eventShow[eventSelect]}
                    </View>
                  </Picker>
                </View>
              </View>
              <View className="section">
                <View className="section-title">
                  <Text>日期选择</Text>
                </View>
                <View>
                  <Picker mode="date" start={dateStart} end={dateEnd} value={dateSel}
                          onChange={this.onDateChange.bind(this)}>
                    <View className="section-picker">当前选择：{dateSel}</View>
                  </Picker>
                </View>
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onReturn.bind(this, false)}>取消</Button>
            <Button onClick={this.onConfirm.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
