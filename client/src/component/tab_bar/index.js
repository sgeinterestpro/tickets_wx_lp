import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from "taro-ui";
import './index.scss'
import getCurrentPageUrl from '../../common/getCurrentPageUrl'

export default class Index extends Taro.Component {
  config = {};

  constructor() {
    super(...arguments)
    this.state = {
      current: -1
    }
  }

  componentDidMount() {
    const currentUrl = `/${getCurrentPageUrl()}`;
    console.debug('url now is: ',currentUrl);
    this.tabList.forEach((element, index) => {
      if (currentUrl == element.url) {
        this.setState({ current: index });
        console.debug('current set to: ', index);
      }
    });
  }

  tabList = [
    { id: 'Ticket_List', url: '/pages/index-list/index', title: '票券夹', iconType: 'tags', text: '1', max: '99' },
    { id: 'Ticket_Scan', url: '/pages/index-scan/index', title: '使用', iconType: 'search' },
    { id: 'Ticket_User', url: '/pages/index-user/index', title: '我', iconType: 'user', text: 'new' }
  ];

  handleClick = currentNext => {
    const { current } = this.state;
    if (currentNext != current) {
      console.debug('url to: ',this.tabList[currentNext].url);
      Taro.redirectTo({ url: this.tabList[currentNext].url })
    }
  };

  render() {
    const { current } = this.state;
    console.debug('current show is: ', current);
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
