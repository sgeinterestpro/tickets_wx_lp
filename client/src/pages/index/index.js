/**
 * muumlover@2019-05-27
 * 小程序默认页面
 * 1、检验用户是否授权小程序获取信息
 * 2、根据用户角色进行默认页面的跳转
 */
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
import {defaultAuthUrl, defaultRoleUrl} from "../../config";
import {userInfoRequest} from "../../apis";

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
    // todo 获取用户状态，根据用户状态决定
    // todo 未授权用户 授权才能拿到 openid，才能确定是谁的微信
    // todo 未绑定用户 绑定了才能对应到具体人员，拿到具体人员信息
    // todo 已绑定用户
    Taro.getUserInfo().then(res => {
      console.log(res);
      userInfoRequest().then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
      Taro.redirectTo({url: defaultRoleUrl[role]})
      // Taro.redirectTo({url: defaultBindUrl})
    }).catch(err => {
      console.warn(err);
      Taro.redirectTo({url: defaultAuthUrl})
    })
  }

  render() {
    return (<View/>)
  }
}
