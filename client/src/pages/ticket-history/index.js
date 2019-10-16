/**
 * muumlover@2019-09-18
 * 用户打卡记录页面
 */
import Taro from "@tarojs/taro"
import {View} from "@tarojs/components"
import {AtTimeline} from "taro-ui"
// import "./index.scss"
import TicketTabBar from "../../component/tab-bar"
import {ticketClass} from "../../config";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "票券使用",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    let sportList = [];
    const {sports} = Taro.getStorageSync("UserInfo");
    if (sports && sports.length > 0) {
      for (let sport of sports) {
        if (ticketClass[sport]) {
          sportList[sport] = ticketClass[sport]
        }
      }
    } else {
      sportList = ticketClass
    }
    this.state = {
      ticketList: Object.keys(sportList),
      signInTime: "2019年09月17日 19:07:15",
      signInType: "羽毛球",
      signInUser: "王森"
    }
  }

  /**
   * 开启微信扫描
   */
  onBtnScanClick = (sport) => {
    Taro.scanCode().then((res) => {
      this.modalTicketDisplayShow(sport, res.result);
    }).catch(() => {
      Taro.showToast({title: "二维码扫描失败", icon: "none"}).then()
    })
  };

  /**
   * 显示票券详情对话框
   */
  modalTicketDisplayShow = (sport, url) => {
    this.setState({
      signInType: sport,
      signInTime: "2019年09月17日 18:25:23",
      modalTicketDisplayShow: true
    })
  };

  /**
   * 关闭券详情对话框操作
   */
  modalTicketDisplayReturn = (res) => {
    this.setState({
      modalTicketDisplayShow: false
    });
  };

  render() {
    const {ticketList, modalTicketDisplayShow, signInTime, signInType, signInUser} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <View class="block">
          <View class="body">
            <AtTimeline
              pending
              items={[
                {title: '羽毛球', content: ['2019-09-17 12:26:55']},
                {title: '乒乓球', content: ['2019-09-17 12:26:55']},
                {title: '瑜伽', content: ['2019-09-17 12:26:55']},
                {title: '游泳', content: ['2019-09-17 12:26:55']}
              ]}
            >
            </AtTimeline>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
