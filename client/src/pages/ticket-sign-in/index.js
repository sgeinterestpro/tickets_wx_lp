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
      sportList: Object.keys(sportList),
      ticketList: [],
      signInTime: "2019年09月17日 19:07:15",
      signInType: "羽毛球",
      signInUser: "王森"
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
      Taro.hideNavigationBarLoading();
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
          this.modalTicketDisplayShow(sportClass, res.result);
        }
      }).catch();
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
    const {sportList, ticketList, modalTicketDisplayShow, signInTime, signInType, signInUser} = this.state;

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
              {sportList.length > 0 ?
                sportList.map((sport, index) => (
                  <AtListItem
                    key={index}
                    title={ticketClass[sport]}
                    extraText={ticketState[sport]}
                    disabled={use_count >= all_count}
                    arrow="right"
                    thumb={ticketIcon[sport]}
                    onClick={this.onBtnScanClick.bind(this, sport)}
                  />
                )) :
                <AtListItem className="item" title="今日无可用项目"/>
              }
            </AtList>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
