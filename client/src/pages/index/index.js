/**
 * muumlover@2019-05-27
 * 小程序默认页面
 * 1、检验用户是否授权小程序获取信息
 * 2、根据用户角色进行默认页面的跳转
 */
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
import {defaultBindUrl, defaultRoleUrl} from "../../config";

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
    const role = Taro.getStorageSync('role') || 'other';
    Taro.getUserInfo().then(res => {
      console.log(res);
      Taro.redirectTo({url: defaultRoleUrl[role]})
    }).catch(err => {
      console.log(err);
      Taro.redirectTo({url: defaultBindUrl})
    })
  }

  render() {
    return (<View/>)
  }
}
