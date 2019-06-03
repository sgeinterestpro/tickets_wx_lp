/**
 * muumlover@2019-05-27
 * 票券详情页面
 * 1、显示票券二维码
 * 2、显示票券其他信息
 * 3、点击二维码放大
 * 4、TODO 显示准确的票券信息
 */
import Taro, {Component} from '@tarojs/taro'
import {Canvas, View} from '@tarojs/components'
import drawQrcode from 'weapp-qrcode';
import './index.scss'

const deviceWidth = 750;
const qrCodeSize = 400;
const qrCodeMaxSize = 666;

export default class Index extends Component {

  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '查看券'
  };

  constructor() {
    super(...arguments);
    this.state = {
      qrShow: false
    }
  }

  componentDidMount() {
    const {id} = this.$router.params;
    // this.setState({ value: id })
    Taro.getSystemInfo({
      success: res => {
        // 设置屏幕比例
        const scale = res.screenWidth / (deviceWidth / 2);
        drawQrcode();
        this.drawQrCode(id, scale);
      }
    }).then(res => console.log(res));

  }

  /**
   * 生成二维码，一个默认显示的二维码，一个放大后的二维码
   * @param value 二维码的内容
   * @param scale 屏幕缩放系数，默认为1（不推荐）
   */
  drawQrCode = (value, scale = 1) => {
    drawQrcode({
      _this: this.$scope,
      canvasId: 'qrCode',
      width: (qrCodeSize / 2) * scale,
      height: (qrCodeSize / 2) * scale,
      text: value
    });
    drawQrcode({
      _this: this.$scope,
      canvasId: 'qrCodeMax',
      width: (qrCodeMaxSize / 2) * scale,
      height: (qrCodeMaxSize / 2) * scale,
      text: value
    });
  };

  /**
   * 二维码点击事件，点击后放大显示二维码
   */
  onQrCodeClick = () => {
    console.log("qrClick");
    const {qrShow} = this.state;
    this.setState({qrShow: !qrShow})
  };

  render() {
    const {qrShow} = this.state;
    return (
      <View class='container'>
        <View class='qrCodeMax' hidden={!qrShow} onClick={this.onQrCodeClick.bind(this)}>
          <Canvas className='code' canvasId='qrCodeMax'/>
        </View>
        <View class='main' hidden={qrShow}>
          <View class='qrCode item' onClick={this.onQrCodeClick.bind(this)}>
            <Canvas className='code' canvasId='qrCode'/>
          </View>
          <View class='round left'/>
          <View class='round right'/>
          <View class='intro'>
            <View class='title'>说明：</View>
            <View>1. 有效期为领取票券时所选日期。</View> {/*TODO 根据数据显示实际日期*/}
            <View>2. 仅供本人使用不可转借他人。</View>
            <View>3. 最终解释权归发券方所有。</View>
          </View>
        </View>
      </View>
    )
  }
}
