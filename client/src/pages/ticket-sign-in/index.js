/**
 * muumlover@2019-09-17
 * 用户打卡打卡页面
 */
import { Image, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { AtButton, AtList, AtListItem, AtModal, AtModalContent } from "taro-ui"
import { ticketPackage, ticketSignIn } from "../../apis"
import TicketTabBar from "../../component/tab-bar"
import { qrCodeBase, ticketClass, ticketIcon, ticketState } from "../../config"
import flash from "../../img/flash.png"
import success from "../../img/success.png"
import "./index.scss"

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "运动打卡",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    let { sports } = Taro.getStorageSync("UserInfo");
    const { real_name } = Taro.getStorageSync("UserInfo");
    let sportKeys = [];
    if (!sports || Object.keys(sports).length <= 0) {
      sports = [];
      sportKeys = Object.keys(ticketClass);
      for (let sport of sportKeys) {
        sports[sport] = {
          name: ticketClass[sport],
          enable: false,
          message: '信息同步失败'
        }
      }
    } else {
      sportKeys = Object.keys(sports);
    }
    this.state = {
      sportKeys: sportKeys,
      sportList: sports,
      ticketList: [],
      signInTime: "2019年09月17日 19:07:15",
      signInType: "badminton",
      signInUser: real_name,
      modalCheckInShow: false,
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
      Taro.setStorage({ key: 'ticket-package-ticketList', data: ticketListNew }).then();
      this.setState({ ticketList: ticketListNew, openIndex: -1, tOpened: false });
    }).catch(err => {
      console.error(err);
      Taro.showModal({ title: "错误", content: "数据加载失败", showCancel: false }).then();
    });
  };

  signIn = (checker_id, sportClass) => {
    ticketSignIn({
      checker_id: checker_id,
      class: sportClass
    }).then((res) => {
      this.updateTicketList();
      if (res.code !== 0) {
        Taro.showModal({ content: res.message, showCancel: false }).then();
      } else {
        this.checkInShow(sportClass, res.data.time);
      }
    }).catch();
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
        return Taro.showToast({ title: "错误的二维码", icon: "none" }).then();
      Taro.showModal({
        title: ticketClass[sportClass],
        content: "您正在打卡“" + ticketClass[sportClass] + "”运动项目，请确认项目信息准确后点击确认按钮完成打卡。",
        confirmText: "确认",
        cancelText: "取消",
      }).then(res => res.confirm && !res.cancel).then(confirm => {
        if (confirm) this.signIn(result_list[1], sportClass);
        else Taro.showToast({ title: "打卡已取消", icon: "none" }).then()
      });
    }).catch(() => {
      Taro.showToast({ title: "扫描已取消", icon: "none" }).then()
    })
  };

  /**
   * 显示票券详情对话框
   */
  checkInShow = (sport, time) => {
    this.setState({
      signInType: sport,
      signInTime: time,
      modalCheckInShow: true
    })
  };

  /**
   * 关闭券详情对话框操作
   */
  onCheckInClose = () => {
    this.setState({
      modalCheckInShow: false
    });
  };

  render() {
    const { sportKeys, sportList, ticketList, modalCheckInShow, signInTime, signInType, signInUser } = this.state;

    const all_count = 3;
    const use_count = ticketList.length;

    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <View class="transparent-modal">
          <AtModal isOpened={modalCheckInShow} closeOnClickOverlay={false}>
            <AtModalContent>
              <View class="text title">打卡成功！</View>
              <View class="float-block">
                <View class="background">
                  <Image src={flash} mode="aspectFill" />
                </View>
                <View class="container">
                  <View class="icon">
                    <Image src={ticketIcon[signInType] || success} />
                  </View>
                  <View class="text blank big">{signInUser}</View>
                  <View class="text blank">{ticketClass[signInType]}</View>
                  <View class="text blank">{signInTime}</View>
                </View>
              </View>
              <AtButton className="button" circle onClick={this.onCheckInClose.bind(this)}>关闭</AtButton>
            </AtModalContent>
          </AtModal>
        </View>

        <View class="block">
          <View class="body center">本周已打卡 {use_count}/{all_count} 次</View>
          {ticketList.length > 0 && <View class="list">
            <AtList hasBorder={false}>
              {ticketList.map((item, index) => (
                <AtListItem
                  key={index}
                  title={ticketClass[item["class"]]}
                  note={item["expiry_date"]}
                  thumb={ticketIcon[item["class"]]}
                />
              ))}
            </AtList>
          </View>}
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
                <AtListItem className="list-item" title="今日无可用项目" />
              }
            </AtList>
          </View>
        </View>
        <TicketTabBar />
      </View>
    )
  }
}
