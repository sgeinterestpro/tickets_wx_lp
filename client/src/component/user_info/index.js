import {Component} from '@tarojs/taro'
import {OpenData, View} from '@tarojs/components'
import {AtAvatar} from 'taro-ui'
import './index.scss'

export default class Index extends Component {

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
    const {ticket_num} = this.state;
    return (
      <View class='container'>
        <View class='main'>
          <View class='avatar'>
            <AtAvatar openData={{type: 'userAvatarUrl'}}/>
          </View>
          <View class='info'>
            <OpenData type="userNickName"/>
          </View>
        </View>
      </View>
    )
  }
}
