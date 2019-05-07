import Taro from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import {AtList, AtListItem} from 'taro-ui';
import './index.scss'
import bg from '../../img/bg.png'
import {getAvailableTickets} from "../../apis";

export default class Index extends Taro.Component {
  config = {
    backgroundColor: "#356284",
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1A5784',
    navigationBarTitleText: '票券助手',
    enablePullDownRefresh: true,
  };

  constructor() {
    super(...arguments)

    this.state = {
      tickets: [
        {
          id: '123123123',
          name: '游泳券',
          desc: '凭此券可使用游泳馆2小时',
        }, {
          id: '123234234',
          name: '羽毛球券',
          desc: '凭此券可使用羽毛球馆2小时',
        }]
    }
  }

  componentDidMount() {
    getAvailableTickets().then(res => {
      console.log(res);
    })
  }

  onShareAppMessage() {
    return {
      title: 'Tickets',
      path: '/pages/index_new/index',
    }
  }

  onTicketClick = (item) => {
    Taro.navigateTo({
      url: `/pages/ticket_show/index?id=${item._id}`
    })
  };

  render() {
    const {tickets} = this.state;

    return (
      <View className='page page-index'>
        <View className='module-list at-row'>
          <Image className='module-list__bg' mode='widthFix' src={bg}/>
          <View className='module-list__item at-col'>
            <View className='module-list__item__icon at-icon at-icon-shopping-bag'/>
            <View className='module-list__item__title'>领取</View>
          </View>
          <View className='module-list__item at-col' onClick={this.onScanClick.bind(this)}>
            <View className='module-list__item__icon at-icon at-icon-search'/>
            <View className='module-list__item__title'>使用</View>
          </View>
        </View>
        <View className='ticket-link'>
          <AtListItem className='ticket-link__item' title='我的票券' hasBorder={false} arrow='right'
                      iconInfo={{size: 25, color: '#78A4FA', value: 'tags',}}/>
        </View>
        <View className='ticket-list'>
          <View className='ticket-list__title'>可用票券</View>
          <AtList hasBorder={false}>
            {tickets.map((item, index) => (
              <AtListItem
                key={index}
                title={item.name}
                note={item.desc}
                arrow='right'
                extraText='去使用'
                onClick={this.onTicketClick.bind(this, item)}
              />))}
            {/*<AtDivider content='没有更多了'/>*/}
          </AtList>
        </View>
      </View>
    )
  }
}
