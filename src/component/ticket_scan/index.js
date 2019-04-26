import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtInput} from 'taro-ui'
import ModalTicketDisplay from "../modal_ticket_display";
import './index.scss'
import {useTicket} from "../../apis";

export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      ticket_id: "",
      modal_ticket_display_show: false
    }
  }

  /**
   * 保存输入框数据更改
   * @param value
   */
  handleInputChange = (value) => {
    this.setState({ticket_id: value})
  };

  /**
   * 开启微信扫描
   */
  onBtnScanClick = () => {
    Taro.scanCode().then(
      (res) => this.modalTicketDisplayShow(res.result))
  };

  /**
   * 显示券详情
   * @constructor
   */
  modalTicketDisplayShow = (ticket_id) => {
    this.setState({
      ticket_id: ticket_id,
      modal_ticket_display_show: true,
    })
  };

  /**
   * 关闭券详情
   * @constructor
   */
  modalTicketDisplayHide = () => {
    this.setState({
      ticket_id: '',
      modal_ticket_display_show: false
    })
  };

  /**
   * 提交使用票券
   */
  ticketUsedSubmit = (ticket_id) => {
    console.log(ticket_id);
    useTicket(ticket_id, {'state': 'used'}).then((res) => {
      if (res.code !== 0) {
        Taro.showModal({content: res.message, showCancel: false});
      } else {
        Taro.showModal({content: '使用成功', showCancel: false});
        this.modalTicketDisplayHide();
      }
    })
  };

  render() {
    const {ticket_id, modal_ticket_display_show} = this.state;
    return (
      <View class='container'>
        <ModalTicketDisplay
          isOpened={modal_ticket_display_show}
          onConfirm={this.ticketUsedSubmit.bind(this)}
          onClose={this.modalTicketDisplayHide.bind(this)}
          ticket_id={ticket_id}
        />
        <View class='main'>
          <View class='input-container'>
            <AtInput border={false} value={ticket_id} onChange={this.handleInputChange.bind(this)}
                     placeholder='手动输入电子票券'>
              <AtButton type='primary' onClick={this.onBtnScanClick.bind(this)}>扫描</AtButton>
            </AtInput>
          </View>
          <View class='btn-submit'>
            <AtButton type='primary' onClick={this.modalTicketDisplayShow.bind(this, ticket_id)}>手动提交</AtButton>
          </View>
        </View>
        <TabBar current="ticket_scan"/>
      </View>
    )
  }
}
