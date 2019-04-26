import Taro, {Component} from '@tarojs/taro'
import {Button, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtModalContent, AtModalHeader} from 'taro-ui'
import {getTicketInfo} from "../../apis";
import './index.scss'

export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {}
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.isOpened === true && prevProps.isOpened === false) {
      const {ticket_id} = this.props;
      //查询并显示票券详细信息
      getTicketInfo(ticket_id).then((res) => {
        console.log(res);
        if (res.code !== 0) {
          Taro.showModal({content: res.message, showCancel: false});
        } else {
          this.setState({
            ticket_title: res.ticket['title'],
            ticket_date: res.ticket['date'],
            ticket_state: res.ticket['state'],
            user_open_id: res.user['open-id'],
          });
        }
      });
    }
  }

  render() {
    const {onConfirm, onClose, isOpened, ticket_id} = this.props;
    const {ticket_title, ticket_date, ticket_state, user_open_id} = this.state;
    return (
      <View class='container'>
        <AtModal isOpened={isOpened} onClose={onClose}>
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
              onClick={onConfirm.bind(this, ticket_id)}
              disabled={ticket_state !== 'unused'}
            >{ticket_state === 'unused' ? '立即使用' : '无法使用'}</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
