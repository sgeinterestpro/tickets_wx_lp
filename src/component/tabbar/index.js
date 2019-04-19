import Taro from '@tarojs/taro'
import {View} from "@tarojs/components";
import {AtTabBar} from "taro-ui";
import './index.scss'

export default class Index extends Taro.Component {
  config = {
    navigationBarTitleText: '券'
  }

  tabList = [
    {id: 'Ticket_List', title: '票券夹', iconType: 'tags', text: 'new'},
    {id: 'Ticket_Scan', title: '使用', iconType: 'search'},
    {id: 'Ticket_User', title: '我', iconType: 'user', text: '100', max: '99'}
  ]

  pageList = [
    'ticket_list',
    'ticket_scan',
    'ticket_user',
  ]


  constructor() {
    super(...arguments)
    this.state = {}
  }

  gotoPanel = id => {
    Taro.redirectTo({
      url: `/pages/${id.toLowerCase()}/index`
    })
  }

  handleClick = (current) => {
    console.log(current);
    console.log(this.tabList[current].id);
    this.gotoPanel(this.tabList[current].id);
  };

  render() {

    const current = this.pageList.indexOf(this.props.current);
    console.log(this.props.current);
    console.log(current);
    return (
      <View>
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
