import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtList, AtListItem} from "taro-ui";
import './index.scss'
import TabBar from "../../component/tabbar";

export default class Index extends Component {

  config = {
    navigationBarTitleText: '所有券'
  }

  constructor() {
    super(...arguments)
    this.state = {
      list: [
        {
          id: 'sport_201904150001',
          title: '运动券',
          note: '乒乓球',
        },
        {
          id: 'sport_201904150002',
          title: '运动券',
          note: '羽毛球',
        },
        {
          id: 'sport_201904150003',
          title: '运动券',
          note: '游泳',
        },
      ]
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

  /**
   * 券点击事件，跳转到票券详情
   * @param item 票券参数
   */
  onTicketClick = (item) => {
    Taro.navigateTo({
      url: `/pages/ticket_show/index?id=${item.id}&name=${item.name}`
    })
  };

  render() {
    const {list} = this.state;
    return (
      <View class='container'>
        <View class='main'>
          <AtList>
            {list.map((item, index) => (
              <AtListItem
                className='item'
                key={index}
                title={item.title}
                note={item.note}
                extraText='查看'
                arrow='right'
                thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
                onClick={this.onTicketClick.bind(this, item)}
              />
            ))}
          </AtList>
        </View>
        <View class='input-container'>
          <AtButton
            type='secondary'
            circle
            disabled
          >无法领取更多</AtButton>
        </View>
        <TabBar current="ticket_list"/>
      </View>
    )
  }
}
