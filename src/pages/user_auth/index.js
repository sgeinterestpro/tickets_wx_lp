import Taro, {Component} from '@tarojs/taro'
import {Canvas, View} from '@tarojs/components'
import drawQrcode from 'weapp-qrcode';
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '二维码详情',
  };

  constructor() {
    super(...arguments);
    this.state = {currentBrightness: 1}
  }

  componentDidMount() {
    const {value} = this.$router.params;
    Taro.getSystemInfo({
      success: res => {
        // 设置屏幕比例
        const scale = res.screenWidth / (750 / 2);
        this.drawQrCode(value, scale);
      }
    }).then(res => console.log(res));
    if (false) {
      Taro.setKeepScreenOn({
        keepScreenOn: true
      });
      Taro.getScreenBrightness().then((res) => {
        this.setState({currentBrightness: res.value});
        Taro.setScreenBrightness({
          value: 1
        });
      });
    }
  }

  componentWillUnmount() {
    if (false) {
      const {currentBrightness} = this.state;
      Taro.setKeepScreenOn({
        keepScreenOn: false
      });
      Taro.setScreenBrightness({
        value: currentBrightness
      });
    }
  }

  /**
   * 生成二维码
   * @param value
   * @param scale
   */
  drawQrCode = (value, scale = 1) => {
    drawQrcode({
      width: (600 / 2) * scale,
      height: (600 / 2) * scale,
      canvasId: 'QrCode',
      _this: this.$scope,
      text: value
    });
  };

  onQrCodeClick = () => {
    Taro.navigateBack();
  };

  render() {
    return (
      <View class='container'>
        <Canvas className='qrcode' canvasId='QrCode' onClick={this.onQrCodeClick.bind(this)}/>
      </View>
    )
  }
}
