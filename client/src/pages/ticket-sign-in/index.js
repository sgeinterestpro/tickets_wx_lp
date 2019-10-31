/**
 * muumlover@2019-09-17
 * 用户打卡签到页面
 */
import Taro from "@tarojs/taro"
import {Image, View} from "@tarojs/components"
import {AtButton, AtList, AtListItem, AtModal, AtModalContent} from "taro-ui"
import "./index.scss"
import TicketTabBar from "../../component/tab-bar"
import flash from "../../img/flash.png"
import success from "../../img/success.png"
import {qrCodeBase, ticketClass, ticketIcon, ticketState} from "../../config";
import {ticketPackage, ticketSignIn} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "运动打卡",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    let {sports} = Taro.getStorageSync("UserInfo");
    const {real_name} = Taro.getStorageSync("UserInfo");
    console.log(sports);
    let sportKeys = Object.keys(sports);
    if (!sportKeys || Object.keys(sportKeys).length <= 0) {
      sportKeys = Object.keys(ticketClass);
      for (let sport of sportKeys) {
        sports[sport] = {
          name: ticketClass[sport],
          enable: false,
          message: '信息同步失败'
        }
      }
    }
    this.state = {
      sportKeys: sportKeys,
      sportList: sports,
      ticketList: [],
      signInTime: "2019年09月17日 19:07:15",
      signInType: "",
      signInUser: real_name
    }
  }

  /**
   * 页面显示事件，触发更新数据
   */
  componentDidShow() {
    this.updateTicketList();
  }

  /**
   * 更新页面内票券列表数据
   * 出发下拉刷新加载动画
   */
  updateTicketList = () => {
    ticketPackage().then(res => {
      let ticketListNew = [];
      res.items.map((item) => {
        ticketListNew.push(item)
      });
      Taro.setStorage({key: 'ticket-package-ticketList', data: ticketListNew}).then();
      this.setState({ticketList: ticketListNew, openIndex: -1, tOpened: false});
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
    });
  };

  /**
   * 开启微信扫描
   */
  onBtnScanClick = (sportClass) => {
    Taro.scanCode().then((res) => {
      console.log(res);
      const result = res.result;
      const result_list = result.split('?');
      console.log(result_list);
      if (result_list.length < 2 || result_list[0] !== qrCodeBase)
        return Taro.showToast({title: "二维码无效", icon: "none"}).then();
      ticketSignIn({
        checker_id: result_list[1],
        class: sportClass
      }).then((res) => {
        this.updateTicketList();
        if (res.code !== 0) {
          Taro.showModal({content: res.message, showCancel: false}).then();
        } else {
          this.modalTicketDisplayShow(sportClass, res.data.time);
        }
      }).catch();
    }).catch(() => {
      Taro.showToast({title: "二维码扫描失败", icon: "none"}).then()
    })
  };

  /**
   * 显示票券详情对话框
   */
  modalTicketDisplayShow = (sport, time) => {
    this.setState({
      signInType: sport,
      signInTime: time,
      modalTicketDisplayShow: true
    })
  };

  /**
   * 关闭券详情对话框操作
   */
  modalTicketDisplayReturn = () => {
    this.setState({
      modalTicketDisplayShow: false
    });
  };

  render() {
    const {sportKeys, sportList, ticketList, modalTicketDisplayShow, signInTime, signInType, signInUser} = this.state;

    const all_count = 3;
    const use_count = ticketList.length;

    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <View class="transparent-modal">
          <AtModal isOpened={modalTicketDisplayShow} closeOnClickOverlay={false}>
            <AtModalContent>
              <View class="text title">打卡成功！</View>
              <View class="float-block">
                <View class="background">
                  <Image src={flash} mode="aspectFill"/>
                </View>
                <View class="container">
                  <View class="icon">
                    <Image src={ticketIcon[signInType] || success}/>
                  </View>
                  <View class="text blank">{signInTime}</View>
                  <View class="text blank">{ticketClass[signInType]}</View>
                  <View class="text blank">{signInUser}</View>
                </View>
              </View>
              <AtButton className={"button"} circle onClick={this.modalTicketDisplayReturn.bind(this)}>完成打卡</AtButton>
            </AtModalContent>
          </AtModal>
        </View>

        <View class="block center">
          <View class="body">本周已打卡 {use_count}/{all_count} 次</View>
        </View>

        <View class="block">
          <View class="list">
            <AtList hasBorder={false}>
              {sportKeys.length > 0 ?
                sportKeys.map((sport, index) => (
                  <AtListItem
                    key={index}
                    title={ticketClass[sport]}
                    extraText={ticketState[sport]}
                    disabled={!sportList[sport].enable}
                    note={sportList[sport].message}
                    arrow="right"
                    thumb={ticketIcon[sport]}
                    onClick={this.onBtnScanClick.bind(this, sport)}
                  />
                )) :
                <AtListItem className="list-item" title="今日无可用项目"/>
              }
            </AtList>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
