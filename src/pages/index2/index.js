import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtTabBar} from "taro-ui";
import './index.scss'
import TicketList from '../ticket_list/index'
import TicketScan from '../ticket_scan/index'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '券',
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments)

    this.state = {
      current: 0
    }
  }


  onShareAppMessage() {
    return {
      title: 'Tickets',
      path: '/pages/index/index',
    }
  }

  tabList = [
    {id: 'Ticket_List', title: '票券夹', iconType: 'tags', text: 'new'},
    {id: 'Ticket_Scan', title: '使用', iconType: 'search'},
    {id: 'Ticket_User', title: '我', iconType: 'user', text: '100', max: '99'}
  ];

  handleClick = current => {
    this.setState({current})
  };

  render() {
    const {current} = this.state;

    return (
      <View>
        {current === 0 && <TicketList>1</TicketList>}
        {current === 1 && <TicketScan>2</TicketScan>}
        {current === 2 && <View>个人信息</View>}
        <AtTabBar
          backgroundColor='#ececec'
          color='#ea6bb8'
          tabList={this.tabList}
          onClick={this.handleClick.bind(this)}
          current={current}
          fixed
        />
      </View>
    )
  }
}
