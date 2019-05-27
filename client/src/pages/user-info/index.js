import Taro from '@tarojs/taro'
import {OpenData, Picker, View} from '@tarojs/components'
import {AtAvatar} from 'taro-ui'
import './index.scss'
import {roleList} from "../../config";
import TicketTabBar from '../../component/tab-bar'

export default class Index extends Taro.Component {
  config = {
    navigationBarBackgroundColor: '#383c42',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: false,
  };

  constructor() {
    super(...arguments);
    this.state = {
      ticketNum: '',
      roleSelect: ''
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    const role = Taro.getStorageSync('role') || 'other';
    const role_keys = Object.keys(roleList);
    this.setState({
      roleSelect: role_keys.indexOf(role)
    })
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  onRoleChange = e => {
    const roleSelect = e.detail.value;
    const role_keys = Object.keys(roleList);
    const role_key = role_keys[e.detail.value];
    Taro.setStorageSync('role', role_key);
    this.setState({roleSelect});
    Taro.reLaunch({url: '/pages/user-info/index'});
  };

  render() {
    const {roleSelect} = this.state;
    const role_values = Object.values(roleList);
    console.log(roleSelect);
    return (
      <View class='container'>
        <View class='main'>
          <View class='avatar'>
            <AtAvatar openData={{type: 'userAvatarUrl'}}/>
          </View>
          <View class='info'>
            <OpenData type='userNickName'/>
          </View>
        </View>
        <View class='item-list'>
          <View class='item'>
            <Picker mode='selector' range={role_values} value={roleSelect}
                    onChange={this.onRoleChange.bind(this)}>
              <View className='picker'>
                当前选择：{role_values[roleSelect]}
              </View>
            </Picker>
          </View>
        </View>
        <TicketTabBar/>
      </View>
    )
  }
}
