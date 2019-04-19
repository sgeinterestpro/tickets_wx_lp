import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtInput} from 'taro-ui'
import './index.scss'
import TabBar from "../../component/tabbar";

export default class Index extends Component {

  config = {
    navigationBarTitleText: '扫描券'
  }

  constructor() {
    super(...arguments)
    this.state = {
      ticket_num: ""
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  /**
   * 保存输入框数据更改
   * @param value
   */
  handleInputChange = (value) => {
    this.setState({ticket_num: value})
  }

  /**
   * 开启微信扫描
   */
  handleScan = () => {
    Taro.scanCode().then(
      (res) => {
        console.log(res);
        this.setState({
          ticket_num: res.result,
        })
      })
  };

  /**
   * 提交使用票券
   */
  handleSubmit = () => {
    const {ticket_num} = this.state;
    Taro.showToast({
      icon: 'none',
      title: ticket_num
    })
  };

  render() {
    const {ticket_num} = this.state;
    return (
      <View class='container'>
        <View class='main'>
          <View class='input-container'>
            <AtInput border={false} value={ticket_num} onChange={this.handleInputChange} placeholder='输入转换内容'>
              <AtButton type='primary' onClick={this.handleScan}>扫描</AtButton>
            </AtInput>
          </View>
          <View class='btn-submit'>
            <AtButton type='primary' onClick={this.handleSubmit}>提交</AtButton>
          </View>
        </View>
        <TabBar current="ticket_scan"/>
      </View>
    )
  }
}
