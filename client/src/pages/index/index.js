import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '票券助手',
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments)
  }

  componentWillMount() {
    Taro.getUserInfo().then(res => {
      console.log(res);
      Taro.redirectTo({ url: '/pages/index-list/index' })
    }).catch(err => {
      console.log(err);
      Taro.redirectTo({ url: '/pages/user-auth/index' })
    })
  }

  render() { return (<View />) }
}
