import Taro, {Component} from '@tarojs/taro'
import {Button, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtToast} from 'taro-ui'
import {getTicketInfo, useTicket} from "../../apis";
import './index.scss'

export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      toast_loading: true,
      ticket_show: false,
      ticket_title: '',
      ticket_date: '',
      ticket_state: '',
      user_open_id: ''
    }
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.isOpened === true && prevProps.isOpened === false) {
      const {onClose, ticket_id} = this.props;
      //查询并显示票券详细信息
      getTicketInfo(ticket_id).then((res) => {
        console.log(res);
        this.setState({toast_loading: false});
        if (res.code !== 0) {
          Taro.showModal({content: res.message, showCancel: false});
          this.onReturn();
        } else {
          this.setState({
            ticket_show: true,
            ticket_title: res.ticket['title'],
            ticket_date: res.ticket['date'],
            ticket_state: res.ticket['state'],
            user_open_id: res.user['openid'],
          });
        }
      });
    }
  }

  /**
   * 提交使用票券
   */
  onConfirm = (ticket_id) => {
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

  onReturn = () => {
    this.setState({toast_loading: true, ticket_show: false});
    this.props.onReturn();
  };

  render() {
    const {isOpened, ticket_id} = this.props;
    const {ticket_show, ticket_title, ticket_date, ticket_state, user_open_id, toast_loading} = this.state;
    return (
      isOpened &&
      <View class='container'>
        <AtToast isOpened={toast_loading} text='加载中...' status='loading' duration={0} hasMask/>
        <AtModal isOpened={ticket_show} onClose={this.onReturn.bind(this)}>
          <AtModalHeader>详情</AtModalHeader>
          <AtModalContent>
            <View className='page-section'>
              <View className='page-section-title'>
                <Text>项目：{ticket_title}</Text>
              </View>
              <View className='page-section-title'>
                <Text>券码：{ticket_id}</Text>
              </View>
              <View className='page-section-title'>
                <Text>使用日期：{ticket_date}</Text>
              </View>
              <View className='page-section-title'>
                <Text>用户信息：{user_open_id}</Text>
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            {/*<Button onClick={onClose.bind(this)}>取消</Button>*/}
            <Button
              onClick={this.onConfirm.bind(this, ticket_id)}
              disabled={ticket_state !== 'unused'}
            >{ticket_state === 'unused' ? '立即使用' : '无法使用'}</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
