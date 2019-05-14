import Taro from '@tarojs/taro'
import { OpenData, View } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import './index.scss'
import TicketTabBar from '../../component/tab_bar'

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments)
    this.state = {
      ticket_num: ""
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    const { ticket_num } = this.state;
    return (
      <View class='container'>
        <View class='main'>
          <View class='avatar'>
            <AtAvatar openData={{ type: 'userAvatarUrl' }} />
          </View>
          <View class='info'>
            <OpenData type='userNickName' />
          </View>
        </View>
        <TicketTabBar />
      </View>
    )
  }
}
