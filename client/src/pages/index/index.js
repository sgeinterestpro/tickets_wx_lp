import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtTabBar} from "taro-ui";
import './index.scss'
import TicketList from '../../component/ticket_list/index'
import TicketScan from '../../component/ticket_scan/index'
import UserInfo from '../../component/user_info/index'

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '票券助手',
    // enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments)

    this.state = {
      current: 0
    }
  }

  componentDidMount() {
  }

  onShareAppMessage() {
    return {
      title: 'Tickets',
      path: '/pages/index/index',
    }
  }

  tabList = [
    {id: 'Ticket_List', title: '票券夹', iconType: 'tags', text: '1', max: '99'},
    {id: 'Ticket_Scan', title: '使用', iconType: 'search'},
    {id: 'Ticket_User', title: '我', iconType: 'user', text: 'new'}
  ];

  handleClick = current => {
    this.setState({current})
  };

  render() {
    const {current} = this.state;

    return (
      <View>
        {current === 0 && <TicketList>票券列表</TicketList>}
        {current === 1 && <TicketScan>票券扫描</TicketScan>}
        {current === 2 && <UserInfo>个人信息</UserInfo>}
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
