import Taro, {Component} from '@tarojs/taro'
import {Canvas, View} from '@tarojs/components'
import drawQrcode from 'weapp-qrcode';
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '查看券'
  }

  constructor() {
    super(...arguments)
    this.state = {
      value: ''
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { id } = this.$router.params
    this.setState({value: id})
    Taro.getSystemInfo({
      success: res => {
        // 设置屏幕比例
        const scale = res.screenWidth / 375;
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
      width: 200 * scale,
      height: 200 * scale,
      canvasId: 'myQrcode',
      _this: this.$scope,
      text: value
    });
  };

  render() {
    const {value} = this.state;
    return (
      <View class='container'>
        <View class='main'>
          <View class='qrcode item'>
            <Canvas className='scanCode' canvasId='myQrcode' />
            <View class='tips'> {value} </View>
          </View>
          <View class='round left' />
          <View class='round right' />
          <View class='intro item'>
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
