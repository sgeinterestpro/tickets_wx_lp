/**
 * muumlover@2019-05-27
 * 检票员展示二维码页面
 */
import Taro from "@tarojs/taro"
import {Canvas, View} from "@tarojs/components"
import "./index.scss"
import TicketTabBar from "../../component/tab-bar"
import ModalTicketDisplay from "../../component/module-ticket-checked";
import {qrCodeBase} from "../../config";
import {ticketCheckLog} from "../../apis";
import drawQrcode from "weapp-qrcode";

const deviceWidth = 750;
const qrCodeSize = 500;

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: "#383c42",
    navigationBarTextStyle: "white",
    navigationBarTitleText: "票券扫描",
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      ticketId: "",
      modalTicketDisplayShow: false,
      ticketCheckLogList: Taro.getStorageSync('ticket-scan-LogList') || []
    }
  }

  componentDidMount() {
    const {init_id: user_id} = Taro.getStorageSync('UserInfo');
    console.log(user_id);
    Taro.getSystemInfo({
      success: res => {
        // 设置屏幕比例
        const {screenWidth} = res;
        const scale = screenWidth / (deviceWidth / 2);
        console.log(user_id);
        this.showQrCode(`${qrCodeBase}?${user_id}`, scale);
      }
    }).then(res => console.debug(res));
    this.updateTicketCheckLogList();
  }

  /**
   * 生成二维码，一个默认显示的二维码，一个放大后的二维码
   * @param value 二维码的内容
   * @param scale 屏幕缩放系数，默认为1（不推荐）
   */
  showQrCode = (value, scale = 1) => {
    const qrScaleSize = (qrCodeSize / 2) * scale;
    const img_p = 5;
    drawQrcode({
      _this: this.$scope,
      canvasId: "qrCode",
      width: qrScaleSize,
      height: qrScaleSize,
      text: value,
      image: {
        dx: qrScaleSize * (img_p - 1) / (img_p * 2),
        dy: qrScaleSize * (img_p - 1) / (img_p * 2),
        dWidth: qrScaleSize / img_p,
        dHeight: qrScaleSize / img_p,
      }
    });
  };

  /**
   * 更新票券列表记录
   */
  updateTicketCheckLogList = () => {
    let {ticketCheckLogList} = this.state;
    // const nowDate = getNowDay();
    ticketCheckLog().then(res => {
      ticketCheckLogList = res.items;
      Taro.setStorage({key: 'ticket-scan-LogList', data: ticketCheckLogList}).then();
      this.setState({ticketCheckLogList, openIndex: -1, tOpened: false});
    }).catch(err => {
      console.error(err);
      Taro.showModal({title: "错误", content: "数据加载失败", showCancel: false}).then();
    });
  };

  /**
   * 关闭券详情对话框操作
   */
  modalTicketDisplayReturn = (res) => {
    if (res) this.updateTicketCheckLogList();
    this.setState({ticketId: "", modalTicketDisplayShow: false});
  };

  render() {
    const {ticketId, modalTicketDisplayShow, ticketCheckLogList} = this.state;
    // noinspection JSXNamespaceValidation
    return (
      <View class="bg">
        <ModalTicketDisplay
          isOpened={modalTicketDisplayShow}
          onReturn={this.modalTicketDisplayReturn.bind(this)}
          ticketId={ticketId}
        />
        <View class="tickets-scan">
          <View class="qrCode item">
            <Canvas className="code" canvasId="qrCode"/>
          </View>
        </View>
        <View class="block">
          <View class="list">
            {ticketCheckLogList.length > 0 ?
              <View>
                <View class="list-item">
                  <View class="text">
                    {`今日已扫描 ${ticketCheckLogList.length} 张`}
                  </View>
                </View>
                {ticketCheckLogList.map((items, index) => (
                  <View key={index} class="list-item">
                    {items.map((item, index) => (
                      <View key={index} class="text">{item}</View>
                    ))}
                  </View>
                ))}
              </View>
              :
              <View class="list-item none">没有记录</View>
            }
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
