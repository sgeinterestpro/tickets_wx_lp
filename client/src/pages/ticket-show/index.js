import Taro, { Component } from '@tarojs/taro'
import { Canvas, View } from '@tarojs/components'
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
  }

  constructor() {
    super(...arguments)
    this.state = {
      qrShow: false
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { id } = this.$router.params
    // this.setState({ value: id })
    Taro.getSystemInfo({
      success: res => {
        // 设置屏幕比例
        const scale = res.screenWidth / (deviceWidth / 2);
        drawQrcode()
        this.drawQrCode(id, scale);
      }
    }).then(res => console.log(res));

  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  /**
   * 生成二维码
   * @param value
   * @param scale
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

  onQrCodeClick = () => {
    console.log("qrClick");
    const { qrShow } = this.state;
    this.setState({ qrShow: !qrShow })
  }

  render() {
    const { qrShow } = this.state;
    return (
      <View class='container'>
        <View class='qrCodeMax' hidden={!qrShow} onClick={this.onQrCodeClick.bind(this)}>
          <Canvas className='code' canvasId='qrCodeMax' />
        </View>
        <View class='main' hidden={qrShow}>
          <View class='qrCode item' onClick={this.onQrCodeClick.bind(this)} >
            <Canvas className='code' canvasId='qrCode' />
            {/* <View class='tips'> {value} </View> */}
          </View>
          <View class='round left' />
          <View class='round right' />
          <View class='intro'>
            <View class='title'>说明：</View>
            <View>1. 有效期至 2019年5月31日。</View>
            <View>2. 仅供本人使用不可转借他人。</View>
            <View>3. 最终解释权归发券方所有。</View>
          </View>
        </View>
      </View>
    )
  }
}
