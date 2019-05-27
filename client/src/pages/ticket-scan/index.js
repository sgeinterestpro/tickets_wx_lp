/**
 * muumlover@2019-05-27
 * 票券扫描页面
 * 1、提供扫描票券功能
 * 2、显示票券信息供人工核实
 * 3、TODO 显示扫描历史
 */
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtInput} from 'taro-ui'
import './index.scss'
import TicketTabBar from '../../component/tab-bar'
import ModalTicketDisplay from "../../component/modal-ticket-checked";

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '票券使用',
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      ticketId: "",
      modalTicketDisplayShow: false
    }
  }

  /**
   * 保存输入框数据更改
   * @param value
   */
  handleInputChange = (value) => {
    this.setState({ticketId: value})
  };

  /**
   * 开启微信扫描
   */
  onBtnScanClick = () => {
    Taro.scanCode().then((res) => this.modalTicketDisplayShow(res.result))
  };

  /**
   * 显示票券详情对话框
   * @param ticketId 票券ID
   */
  modalTicketDisplayShow = (ticketId) => {
    this.setState({
      ticketId: ticketId,
      modalTicketDisplayShow: true,
    })
  };

  /**
   * 关闭券详情对话框操作
   */
  modalTicketDisplayHide = () => {
    this.setState({
      ticketId: '',
      modalTicketDisplayShow: false
    })
  };

  render() {
    const {ticketId, modalTicketDisplayShow} = this.state;
    return (
      <View class='container'>
        <ModalTicketDisplay
          isOpened={modalTicketDisplayShow}
          onReturn={this.modalTicketDisplayHide.bind(this)}
          ticketId={ticketId}
        />
        <View class='main'>
          <View class='input-container'>
            <AtInput border={false} value={ticketId} onChange={this.handleInputChange.bind(this)}
                     placeholder='手动输入电子票券'
            >
              <AtButton type='primary' onClick={this.onBtnScanClick.bind(this)}>扫描</AtButton>
            </AtInput>
          </View>
          <View class='btn-submit'>
            <AtButton type='primary' onClick={this.modalTicketDisplayShow.bind(this, ticketId)}>手动提交</AtButton>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
