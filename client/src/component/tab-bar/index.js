import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtTabBar} from "taro-ui";
import './index.scss'
import getCurrentPageUrl from '../../common/getCurrentPageUrl'
import {roleTabUrls} from '../../config'

export default class Index extends Taro.Component {
  config = {};

  constructor() {
    super(...arguments);
    this.state = {
      current: -1,
      role: Taro.getStorageSync('role') || 'other'
    }
  }

  componentWillMount() {
    const {role} = this.state;
    const currentUrl = `/${getCurrentPageUrl()}`;
    console.debug('url now is: ', currentUrl);
    const tabList = roleTabUrls[role];
    tabList.forEach((element, current) => {
      if (currentUrl === element.url) {
        this.setState({current, role});
        console.debug('current set to: ', current);
      }
    });
  }

  handleClick = currentNext => {
    const {current, role} = this.state;
    if (currentNext !== current) {
      const tabList = roleTabUrls[role];
      console.debug('url to: ', tabList[currentNext].url);
      Taro.redirectTo({url: tabList[currentNext].url})
    }
  };

  render() {
    const {role, current} = this.state;
    console.debug('current show is: ', current);
    return (
      <View>
        <AtTabBar
          backgroundColor='#ececec'
          color='#ea6bb8'
          tabList={roleTabUrls[role]}
          onClick={this.handleClick.bind(this)}
          current={current}
          fixed
        />
      </View>
    )
  }
}
