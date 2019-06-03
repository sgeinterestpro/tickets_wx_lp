/**
 * muumlover@2019-05-27
 * 用户授权页面
 * 1、用户授权按钮
 * 2、TODO 用户信息获取
 */
import Taro, {redirectTo} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'

export default class Index extends Taro.Component {

  config = {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '二维码详情',
  };

  constructor() {
    super(...arguments);
    this.state = {}
  }

  onGetUserInfo = (res) => {
    console.debug(res);
    redirectTo({url: '/pages/index/index'})
  };

  render() {
    return (
      <View class='container'>
        <View class='icon'>
          ICON
        </View>
        <AtButton
          type='primary'
          openType='getUserInfo'
          size='normal'
          onGetUserInfo={this.onGetUserInfo.bind(this)}
        >
          点击登陆
        </AtButton>
      </View>
    )
  }
}
