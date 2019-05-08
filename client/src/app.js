import Taro, {Component} from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import {login} from "./common/getUserInfo";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/index_new/index',
      'pages/ticket_show/index',
      'pages/qrcode_show/index',
    ],
    window: {
      backgroundColor: "#356284",
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1A5784',
      navigationBarTitleText: '票券助手',
      navigationBarTextStyle: 'white',
    }
  }


  getOpenId = () => {
    login(`/${this.$router.params.path}`)
      .then(() => {
        // console.debug(userInfo)
        Taro.eventCenter.trigger('UnionId')
      })
      .catch(err => {
        Taro.showModal({confirmColor: '#FF0000', content: err, showCancel: false}).then(() => {
          this.getUid()
        })
      })
  }

  componentWillMount() {
    Taro.cloud.init();
    this.getOpenId()
  }

  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index/>
    )
  }
}

Taro.render(<App/>, document.getElementById('app'))
