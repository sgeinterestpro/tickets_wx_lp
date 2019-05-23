import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
import config from "../../config.json";

const authUrl = config['defaultAuthUrl'];
const roleUrlList = config['defaultRoleUrl'];

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
      Taro.redirectTo({url: roleUrlList[role]})
    }).catch(err => {
      console.log(err);
      Taro.redirectTo({url: authUrl})
    })
  }

  render() {
    return (<View/>)
  }
}
